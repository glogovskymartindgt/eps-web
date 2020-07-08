import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { finalize } from 'rxjs/operators';
import { Role } from '../../../shared/enums/role.enum';
import {
    CoreTableComponent, ListItem, TableCellType, TableChangeEvent, TableColumn, TableColumnFilter, TableConfiguration, TableFilterType
} from '../../../shared/hazelnut/core-table';
import { fadeEnterLeave } from '../../../shared/hazelnut/hazelnut-common/animations';
import { BrowseResponse, Filter } from '../../../shared/hazelnut/hazelnut-common/models';
import { FileManager } from '../../../shared/hazelnut/hazelnut-common/utils/file-manager';
import { BusinessArea } from '../../../shared/interfaces/bussiness-area.interface';
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
import { TaskOverviewPersistanceService } from '../task-overview-persistance.service';

/* tslint:disable:no-for-each-push */
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
                       private readonly taskOverviewPersistanceService: TaskOverviewPersistanceService,
                       private readonly authService: AuthService) {
    }

    public ngOnInit(): void {
        this.loadBusinessAreaList();
        const initialBusinessArea: string = this.getBusinessAreaValue();
        this.areaGroup = this.formBuilder.group({
            businessArea: [initialBusinessArea]
        });
        this.taskOverviewPersistanceService.businessAreaFilter = initialBusinessArea;
        this.areaGroup.valueChanges.subscribe((value: any): void => {
            if (value !== 'all') {
                const businessAreaValue: any = value.businessArea;
                this.businessAreaFilter = new Filter('BUSINESS_AREA_NAME', businessAreaValue);
                this.taskOverviewPersistanceService.businessAreaFilter = businessAreaValue;
            }
            this.setTableData();
        });
        this.tableChangeStorageService.isReturnFromDetail = this.isReturnFromDetail();
        this.setTableConfiguration();
    }

    /**
     * navigate create task screen
     */
    public createTask(): void {
        this.router.navigate(['tasks/create']);
    }

    /**
     * Export report from API based on selected filters
     */
    public export(): void {
        this.loading = true;
        this.taskService.exportTasks(this.lastTableChangeEvent, this.additionalFilters, this.projectEventService.instant.id)
            .pipe(finalize((): any => this.loading = false))
            .subscribe((response: any): void => {
                const contentDisposition = response.headers.get('Content-Disposition');
                const exportName: string = GetFileNameFromContentDisposition(contentDisposition);
                new FileManager().saveFile(exportName, response.body, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            }, (): void => {
                this.notificationService.openErrorNotification('error.api');
            });
    }

    /**
     * Navigate to update task screen
     * @param id
     */
    public update(id: number): void {
        this.router.navigate(['tasks', 'edit', id]);
    }

    public setTableData(tableChangeEvent?: TableChangeEvent): void {
        let newTableChangeEvent = tableChangeEvent;
        if (!newTableChangeEvent) {
            newTableChangeEvent = this.taskTable.reset();
        }
        if (newTableChangeEvent && newTableChangeEvent.filters && newTableChangeEvent.filters.length > 0) {
            this.allTaskFilters = newTableChangeEvent.filters;
        }
        this.lastTableChangeEvent = newTableChangeEvent;
        this.tableChangeStorageService.cachedTableChangeEvent = newTableChangeEvent;
        this.setAdditionalFilters();
        this.removeDuplicateFilters();
        this.loading = true;
        this.updateTableChangeEvent(newTableChangeEvent);
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

    private updateTableChangeEvent(newTableChangeEvent: TableChangeEvent): void {
        this.taskService.browseTasks(newTableChangeEvent, this.additionalFilters)
            .pipe(finalize((): any => this.loading = false))
            .subscribe((data: BrowseResponse<TaskInterface>): void => {
                this.data = data;
                this.isInitialized = true;
            }, (): void => {
                this.notificationService.openErrorNotification('error.api');
            });
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

    private setAdditionalFilters(): void {
        this.additionalFilters = [
            new Filter('PROJECT_ID', this.projectEventService.instant.id, 'NUMBER'),
        ];
        if (this.businessAreaFilter && this.businessAreaFilter.value !== 'all') {
            this.additionalFilters.push(this.businessAreaFilter);
        }
        // Add business area filter to additional filters
        if (!this.isInitialized && this.getBusinessAreaValue() !== 'all' && typeof this.getBusinessAreaValue() !== 'undefined') {
            this.additionalFilters.push(this.businessAreaFilter = new Filter('BUSINESS_AREA_NAME', this.getBusinessAreaValue()));
        }

        if (this.allTaskFilters) {
            this.allTaskFilters.forEach((filter: Filter): void => {
                this.additionalFilters.push(filter);
            });
        }
    }

    private setTableConfiguration(): void {
        const allThingsKey = 'all.things';
        const config: TableConfiguration = {
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
                    columnDef: 'sourceDescriptionShort',
                    labelKey: 'task.sourceDescription',
                    columnRequestName: 'sourceDescription',
                    filter: new TableColumnFilter({}),
                    sorting: true,
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

        this.config = this.tableChangeStorageService.updateTableConfiguration(config);
    }

    private removeDuplicateFilters(): void {
        const userIdFilters = this.additionalFilters.filter((el: Filter): any => el.property === 'RESPONSIBLE_USER_ID');
        if (userIdFilters.length > 1) {
            const allUserIdFilters = this.additionalFilters.filter((el: Filter): any => el.property === 'RESPONSIBLE_USER_ID');
            const oneFilter = allUserIdFilters[allUserIdFilters.length - 1];
            this.additionalFilters = this.additionalFilters.filter((el: Filter): any => el.property !== 'RESPONSIBLE_USER_ID');
            this.additionalFilters.push(oneFilter);
        }
    }

    /**
     * Load business area list from API
     */
    private loadBusinessAreaList(): void {
        this.businessAreaService.listBusinessAreas()
            .subscribe((data: BrowseResponse<BusinessArea>): any => {
                this.businessAreaList = data.content
                                            .filter((item: BusinessArea): any => item.codeItem !== null && item.state === 'VALID');
            });
    }

    /**
     * Business area selected from business area list or saved local storage value
     */
    private getBusinessAreaValue(): string {
        let businessAreaValue = this.selectedAreaService.instant.selectedArea;
        if (!this.isInitialized && this.isReturnFromDetail() && this.taskOverviewPersistanceService.businessAreaFilter) {
            businessAreaValue = this.taskOverviewPersistanceService.businessAreaFilter;
        }

        return businessAreaValue;
    }

    /**
     * If returned from edit task form or create task form
     */
    private isReturnFromDetail(): boolean {
        return this.routingStorageService.getPreviousUrl().includes('tasks/edit')
            || this.routingStorageService.getPreviousUrl().includes('tasks/create');
    }

}
