import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Role } from '../../../shared/enums/role.enum';
import {
    CoreTableComponent, ListItem, TableCellType, TableChangeEvent, TableColumn, TableColumnFilter, TableConfiguration, TableFilterType
} from '../../../shared/hazlenut/core-table';
import { fadeEnterLeave } from '../../../shared/hazlenut/hazelnut-common/animations';
import { StringUtils } from '../../../shared/hazlenut/hazelnut-common/hazelnut';
import { BrowseResponse, Filter } from '../../../shared/hazlenut/hazelnut-common/models';
import { FileManager } from '../../../shared/hazlenut/hazelnut-common/utils/file-manager';
import { BusinessArea } from '../../../shared/interfaces/bussiness-area.interface';
import { TaskCommentResponse } from '../../../shared/interfaces/task-comment.interface';
import { TaskInterface } from '../../../shared/interfaces/task.interface';
import { AuthService } from '../../../shared/services/auth.service';
import { BusinessAreaService } from '../../../shared/services/data/business-area.service';
import { TaskService } from '../../../shared/services/data/task.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { RoutingStorageService } from '../../../shared/services/routing-storage.service';
import { ProjectEventService } from '../../../shared/services/storage/project-event.service';
import { SelectedAreaService } from '../../../shared/services/storage/selected-area.service';
import { TableChangeStorageService } from '../../../shared/services/table-change-storage.service';
import { GetFileNameFromContentDisposition } from '../../../shared/utils/headers';

@Component({
    selector: 'iihf-task-list',
    templateUrl: './task-list.component.html',
    styleUrls: ['./task-list.component.scss'],
    animations: [fadeEnterLeave]
})
export class TaskListComponent implements OnInit {
    @ViewChild('trafficLightColumn', {static: true}) public trafficLightColumn: TemplateRef<any>;
    @ViewChild('statusColumn', {static: true}) public statusColumn: TemplateRef<any>;
    @ViewChild('updateColumn', {static: true}) public updateColumn: TemplateRef<any>;
    @ViewChild('taskTypeColumn', {static: true}) public taskTypeColumn: TemplateRef<any>;
    @ViewChild('userColumn', {static: true}) public userColumn: TemplateRef<any>;
    @ViewChild('dateColumn', {static: true}) public dateColumn: TemplateRef<any>;
    @ViewChild('venueColumn', {static: true}) public venueColumn: TemplateRef<any>;
    @ViewChild('taskTable', {static: true}) public taskTable: CoreTableComponent;

    public areaGroup: FormGroup;
    public config: TableConfiguration;
    public data: BrowseResponse<TaskInterface> = new BrowseResponse<TaskInterface>();
    public businessAreaList: BusinessArea[];
    public loading = false;
    private lastTableChangeEvent: TableChangeEvent;
    private isInitialized = false;
    private businessAreaFilter: Filter;
    private allTaskFilters: Filter[] = [];
    private additionalFilters: Filter[] = [];

    public constructor(public readonly projectEventService: ProjectEventService,
                       public readonly selectedAreaService: SelectedAreaService,
                       public readonly businessAreaService: BusinessAreaService,
                       public readonly formBuilder: FormBuilder,
                       private readonly translateService: TranslateService,
                       private readonly router: Router,
                       private readonly taskService: TaskService,
                       private readonly notificationService: NotificationService,
                       private readonly routingStorageService: RoutingStorageService,
                       private readonly tableChangeStorageService: TableChangeStorageService,
                       private readonly authService: AuthService) {
    }

    public ngOnInit() {
        this.loadBusinessAreaList();
        // Business area form group setup
        this.areaGroup = this.formBuilder.group({
            businessArea: [this.getBusinessAreaValue()]
        });
        // Business area input listener and table data reload
        this.areaGroup.valueChanges.subscribe((value) => {
            // Add business area filter if ALL value selected in business area select
            if (value !== 'all') {
                this.businessAreaFilter = new Filter('BUSINESS_AREA_NAME', value.businessArea);
            }
            this.setTableData();
        });
        const allThingsKey = 'all.things';
        // Table config setup
        this.config = {
            stickyEnd: 7,
            columns: [
                new TableColumn({
                    columnDef: 'trafficLight',
                    labelKey: 'task.trafficLight',
                    type: TableCellType.CONTENT,
                    tableCellTemplate: this.trafficLightColumn,
                    filter: new TableColumnFilter({
                        valueType: 'ENUM',
                        type: TableFilterType.TRAFFIC_LIGHT,
                        select: [
                            new ListItem('', this.translateService.instant(allThingsKey)),
                            new ListItem('RED', this.translateService.instant('color.red')),
                            new ListItem('GREEN', this.translateService.instant('color.green')),
                            new ListItem('AMBER', this.translateService.instant('color.amber')),
                        ]
                    }),
                    sorting: true,
                }),
                new TableColumn({
                    columnDef: 'taskType',
                    labelKey: 'task.type',
                    sorting: true,
                    type: TableCellType.CONTENT,
                    tableCellTemplate: this.taskTypeColumn,
                    filter: new TableColumnFilter({
                        valueType: 'ENUM',
                        type: TableFilterType.SELECT,
                        select: [
                            new ListItem('', this.translateService.instant(allThingsKey)),
                            new ListItem('TASK', this.translateService.instant('task.taskTypeValue.task')),
                            new ListItem('ISSUE', this.translateService.instant('task.taskTypeValue.issue')),
                        ]
                    }),
                }),
                new TableColumn({
                    columnDef: 'code',
                    labelKey: 'task.code',
                    type: TableCellType.NUMBER,
                    filter: new TableColumnFilter({
                        type: TableFilterType.NUMBER,
                    }),
                    sorting: true,
                }),
                new TableColumn({
                    columnDef: 'name',
                    labelKey: 'task.name',
                    filter: new TableColumnFilter({}),
                    sorting: true,
                }),
                new TableColumn({
                    columnDef: 'cityName',
                    labelKey: 'task.venue',
                    filter: new TableColumnFilter({
                        valueType: 'STRING',
                        type: TableFilterType.SELECT_STRING,
                        select: [
                            new ListItem('', this.translateService.instant('venue.value.all')),
                            new ListItem('NONE', this.translateService.instant('venue.value.none')),
                            new ListItem(this.projectEventService.instant.firstVenue, this.projectEventService.instant.firstVenue),
                            new ListItem(this.projectEventService.instant.secondVenue, this.projectEventService.instant.secondVenue),
                            new ListItem('BOTH', this.translateService.instant('venue.value.both')),
                        ]
                    }),
                    sorting: true,
                    type: TableCellType.CONTENT,
                    tableCellTemplate: this.venueColumn,
                }),
                new TableColumn({
                    columnDef: 'responsibleUserId',
                    labelKey: 'task.responsible',
                    sorting: true,
                    type: TableCellType.CONTENT,
                    tableCellTemplate: this.userColumn,
                    filter: new TableColumnFilter({
                        valueType: 'STRING',
                        type: TableFilterType.RESPONSIBLE,
                    }),
                }),
                new TableColumn({
                    columnDef: 'dueDate',
                    labelKey: 'task.dueDate',
                    filter: new TableColumnFilter({
                        valueType: 'DATE_TIME',
                        type: TableFilterType.DATETIME_AS_DATERANGE,
                    }),
                    sorting: true,
                    type: TableCellType.CONTENT,
                    tableCellTemplate: this.dateColumn,
                }),
                new TableColumn({
                    columnDef: 'state',
                    labelKey: 'task.status',
                    type: TableCellType.CONTENT,
                    tableCellTemplate: this.statusColumn,
                    filter: new TableColumnFilter({
                        valueType: 'ENUM',
                        type: TableFilterType.SELECT,
                        select: [
                            new ListItem('', this.translateService.instant(allThingsKey)),
                            new ListItem('OPEN', this.translateService.instant('task.statusValue.open')),
                            new ListItem('CLOSED', this.translateService.instant('task.statusValue.closed')),
                        ]
                    }),
                    sorting: true,
                }),
                new TableColumn({
                    columnDef: ' ',
                    label: ' ',
                    type: TableCellType.CONTENT,
                    tableCellTemplate: this.updateColumn,
                    filter: new TableColumnFilter({
                        type: TableFilterType.CLEAR_FILTERS,
                    }),
                }),
            ],
            paging: true,
        };
        // Set table change event data from local storage
        if (!this.isInitialized && this.isReturnFromDetail() && this.tableChangeStorageService.getTasksLastTableChangeEvent()) {
            if (this.tableChangeStorageService.getTasksLastTableChangeEvent().filters) {
                this.config.predefinedFilters = this.tableChangeStorageService.getTasksLastTableChangeEvent().filters;
            }
            if (this.tableChangeStorageService.getTasksLastTableChangeEvent().pageIndex) {
                this.config.predefinedPageIndex = this.tableChangeStorageService.getTasksLastTableChangeEvent().pageIndex;
            }
            if (this.tableChangeStorageService.getTasksLastTableChangeEvent().pageSize) {
                this.config.predefinedPageSize = this.tableChangeStorageService.getTasksLastTableChangeEvent().pageSize;
            }
            if (this.tableChangeStorageService.getTasksLastTableChangeEvent().sortDirection) {
                this.config.predefinedSortDirection = this.tableChangeStorageService.getTasksLastTableChangeEvent()
                                                          .sortDirection
                                                          .toLowerCase();
            }
            if (this.tableChangeStorageService.getTasksLastTableChangeEvent().sortActive) {
                this.config.predefinedSortActive = StringUtils.convertSnakeToCamel(this.tableChangeStorageService.getTasksLastTableChangeEvent()
                                                                                       .sortActive
                                                                                       .toLowerCase());
            }
        }
    }

    /**
     * navigate create task screen
     */
    public createTask() {
        this.router.navigate(['tasks/create']);
    }

    /**
     * Export report from API based on selected filters
     */
    public export() {
        this.loading = true;
        this.taskService.exportTasks(this.lastTableChangeEvent, this.additionalFilters, this.projectEventService.instant.id)
            .subscribe((response) => {
                const contentDisposition = response.headers.get('Content-Disposition');
                const exportName: string = GetFileNameFromContentDisposition(contentDisposition);
                new FileManager().saveFile(exportName, response.body, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                this.loading = false;
            }, () => {
                this.notificationService.openErrorNotification('error.api');
                this.loading = false;
            });
    }

    /**
     * Navigate to update task screen
     * @param id
     */
    public update(id: number) {
        this.router.navigate(['tasks/edit'], {queryParams: {id}});
    }

    public setTableData(tableChangeEvent?: TableChangeEvent): void {
        if (!tableChangeEvent) {
            tableChangeEvent = this.taskTable.reset();
        }
        if (tableChangeEvent && tableChangeEvent.filters && tableChangeEvent.filters.length > 0) {
            this.allTaskFilters = tableChangeEvent.filters;
        }

        this.lastTableChangeEvent = tableChangeEvent;

        this.additionalFilters = [
            new Filter('PROJECT_ID', this.projectEventService.instant.id, 'NUMBER'),
        ];

        if (this.businessAreaFilter && this.businessAreaFilter.value !== 'all') {
            this.additionalFilters.push(this.businessAreaFilter);
        }

        // Add business area filter to additional filters
        if (!this.isInitialized && this.getBusinessAreaValue() !== 'all') {
            this.additionalFilters.push(this.businessAreaFilter = new Filter('BUSINESS_AREA_NAME', this.getBusinessAreaValue()));
        }

        if (this.allTaskFilters) {
            this.allTaskFilters.forEach((filter: Filter) => {
                this.additionalFilters.push(filter);
            });
        }

        this.removeDuplicateFilters();

        this.loading = true;

        // Update table change event values from local storage
        if (!this.isInitialized && this.isReturnFromDetail() && this.tableChangeStorageService.getTasksLastTableChangeEvent()) {
            tableChangeEvent.pageIndex = this.tableChangeStorageService.getTasksLastTableChangeEvent().pageIndex;
            tableChangeEvent.pageSize = this.tableChangeStorageService.getTasksLastTableChangeEvent().pageSize;
            tableChangeEvent.sortDirection = this.tableChangeStorageService.getTasksLastTableChangeEvent().sortDirection;
            tableChangeEvent.sortActive = this.tableChangeStorageService.getTasksLastTableChangeEvent().sortActive;
        }
        this.taskService.browseTasks(tableChangeEvent, this.additionalFilters)
            .subscribe((data) => {
                this.data = data;
                this.loading = false;
                this.isInitialized = true;
            }, () => {
                this.loading = false;
                this.notificationService.openErrorNotification('error.api');
            });

        this.tableChangeStorageService.setTasksLastTableChangeEvent(tableChangeEvent, this.additionalFilters);
    }

    public allowCreateTaskButton(): boolean {
        return this.hasCreateTaskRole() || this.hasCreateTaskRoleInAssignProject();
    }

    public allowExportReportTaskButton(): boolean {
        return this.hasRoleExportReportTask() || this.hasRoleExportReportTaskInAssignProject();
    }

    public allowTaskDetailButton(): boolean {
        return this.authService.hasRole(Role.RoleReadTask) ||
            this.authService.hasRole(Role.RoleReadTaskInAssignProject) ||
            this.authService.hasRole(Role.RoleUpdateTask) ||
            this.authService.hasRole(Role.RoleUpdateTaskInAssignProject);
    }

    public trackBusinessAreaById(index: number, item: BusinessArea): number {
        return item.id;
    }

    private hasCreateTaskRole(): boolean {
        return this.authService.hasRole(Role.RoleCreateTask);
    }

    private hasCreateTaskRoleInAssignProject(): boolean {
        return this.authService.hasRole(Role.RoleCreateTaskInAssignProject);
    }

    private hasRoleExportReportTask(): boolean {
        return this.authService.hasRole(Role.RoleExportReportTask);
    }

    private hasRoleExportReportTaskInAssignProject(): boolean {
        return this.authService.hasRole(Role.RoleExportReportTaskInAssignProject);
    }

    private removeDuplicateFilters(): void {
        const userIdFilters = this.additionalFilters.filter((el: Filter) => el.property === 'RESPONSIBLE_USER_ID');
        if (userIdFilters.length > 1) {
            const allUserIdFilters = this.additionalFilters.filter((el: Filter) => el.property === 'RESPONSIBLE_USER_ID');
            const oneFilter = allUserIdFilters[allUserIdFilters.length - 1];
            this.additionalFilters = this.additionalFilters.filter((el: Filter) => el.property !== 'RESPONSIBLE_USER_ID');
            this.additionalFilters.push(oneFilter);
        }
    }

    /**
     * Load business area list from API
     */
    private loadBusinessAreaList() {
        this.businessAreaService.listBusinessAreas()
            .subscribe((data) => {
                this.businessAreaList = data.content
                                            .filter((item) => item.codeItem !== null && item.state === 'VALID');
            });
    }

    /**
     * Business area selected from business area list or saved local storage value
     */
    private getBusinessAreaValue(): string {
        let businessAreaValue = this.selectedAreaService.instant.selectedArea;
        const tableChangeEventInStorage = this.tableChangeStorageService.getTasksLastTableChangeEvent();
        if (!this.isInitialized && this.isReturnFromDetail() && tableChangeEventInStorage && tableChangeEventInStorage.additionalFilters) {
            businessAreaValue = this.getStorageBusinessAreaFilter(tableChangeEventInStorage) ? this.getStorageBusinessAreaFilter(tableChangeEventInStorage).value : 'all';
        }
        return businessAreaValue;
    }

    /**
     * Get business area filter from local storage value
     * @param tableChangeEventInStorage
     */
    private getStorageBusinessAreaFilter(tableChangeEventInStorage: any): any | undefined {
        if (!tableChangeEventInStorage || !tableChangeEventInStorage.additionalFilters) {
            return;
        }
        return tableChangeEventInStorage.additionalFilters.find((filter) => filter.property === 'BUSINESS_AREA_NAME');
    }

    /**
     * If returned from edit task form or create task form
     */
    private isReturnFromDetail() {
        return this.routingStorageService.getPreviousUrl()
                   .includes('tasks/edit') || this.routingStorageService.getPreviousUrl()
                                                  .includes('tasks/create');
    }

}
