import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { finalize } from 'rxjs/operators';
import { Role } from '../../../shared/enums/role.enum';
import {
    CoreTableComponent, ListItem, TableCellType, TableChangeEvent, TableColumn, TableColumnFilter, TableConfiguration, TableFilterType
} from '../../../shared/hazlenut/core-table';
import { fadeEnterLeave } from '../../../shared/hazlenut/hazelnut-common/animations';
import { StringUtils } from '../../../shared/hazlenut/hazelnut-common/hazelnut';
import { BrowseResponse, Filter } from '../../../shared/hazlenut/hazelnut-common/models';
import { FileManager } from '../../../shared/hazlenut/hazelnut-common/utils/file-manager';
import { ActionPoint } from '../../../shared/models/action-point.model';
import { AuthService } from '../../../shared/services/auth.service';
import { ActionPointService } from '../../../shared/services/data/action-point.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { RoutingStorageService } from '../../../shared/services/routing-storage.service';
import { ProjectEventService } from '../../../shared/services/storage/project-event.service';
import { TableChangeStorageService } from '../../../shared/services/table-change-storage.service';
import { GetFileNameFromContentDisposition } from '../../../shared/utils/headers';

@Component({
    selector: 'iihf-action-point-list',
    templateUrl: './action-point-list.component.html',
    styleUrls: ['./action-point-list.component.scss'],
    animations: [fadeEnterLeave]
})
export class ActionPointListComponent implements OnInit {
    @ViewChild('trafficLightColumn', {static: true}) public trafficLightColumn: TemplateRef<any>;
    @ViewChild('statusColumn', {static: true}) public statusColumn: TemplateRef<any>;
    @ViewChild('updateColumn', {static: true}) public updateColumn: TemplateRef<any>;
    @ViewChild('dateColumn', {static: true}) public dateColumn: TemplateRef<any>;
    @ViewChild('closedDateColumn', {static: true}) public closedDateColumn: TemplateRef<any>;
    @ViewChild('venueColumn', {static: true}) public venueColumn: TemplateRef<any>;
    @ViewChild('actionPointTable', {static: true}) public actionPointTable: CoreTableComponent;

    public config: TableConfiguration;
    public data: BrowseResponse<ActionPoint> = new BrowseResponse<ActionPoint>();
    public loading = false;
    private lastTableChangeEvent: TableChangeEvent;
    private isInitialized = false;
    private businessAreaFilter: Filter;
    private allActionPointFilters: Filter[] = [];
    private additionalFilters: Filter[] = [];

    public constructor(public readonly projectEventService: ProjectEventService,
                       public readonly formBuilder: FormBuilder,
                       private readonly translateService: TranslateService,
                       private readonly router: Router,
                       private readonly actionPointService: ActionPointService,
                       private readonly notificationService: NotificationService,
                       private readonly routingStorageService: RoutingStorageService,
                       private readonly tableChangeStorageService: TableChangeStorageService,
                       private readonly authService: AuthService) {
    }

    public ngOnInit() {
        const allThingsKey = 'all.things';
        // Table config setup
        this.config = {
            stickyEnd: 6,
            columns: [
                new TableColumn({
                    columnDef: 'code',
                    labelKey: 'actionPoint.code',
                    type: TableCellType.NUMBER,
                    filter: new TableColumnFilter({
                        type: TableFilterType.NUMBER,
                    }),
                    sorting: true,
                }),
                new TableColumn({
                    columnDef: 'title',
                    labelKey: 'actionPoint.title',
                    filter: new TableColumnFilter({}),
                    sorting: true,
                }),
                new TableColumn({
                    columnDef: 'cityName',
                    labelKey: 'actionPoint.venue',
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
                    columnDef: 'dueDate',
                    labelKey: 'actionPoint.dueDate',
                    filter: new TableColumnFilter({
                        valueType: 'DATE_TIME',
                        type: TableFilterType.DATETIME_AS_DATERANGE,
                    }),
                    sorting: true,
                    type: TableCellType.CONTENT,
                    tableCellTemplate: this.dateColumn,
                }),
                new TableColumn({
                    columnDef: 'closedDate',
                    labelKey: 'actionPoint.closedDate',
                    filter: new TableColumnFilter({
                        valueType: 'DATE_TIME',
                        type: TableFilterType.DATETIME_AS_DATERANGE,
                    }),
                    sorting: true,
                    type: TableCellType.CONTENT,
                    tableCellTemplate: this.closedDateColumn,
                }),
                new TableColumn({
                    columnDef: 'state',
                    labelKey: 'actionPoint.status',
                    type: TableCellType.CONTENT,
                    tableCellTemplate: this.statusColumn,
                    filter: new TableColumnFilter({
                        valueType: 'ENUM',
                        type: TableFilterType.SELECT,
                        select: [
                            new ListItem('', this.translateService.instant(allThingsKey)),
                            new ListItem('OPEN', this.translateService.instant('task.statusValue.open')),
                            new ListItem('PENDING', this.translateService.instant('task.statusValue.pending')),
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
        this.router.navigate(['action-points/create']);
    }

    /**
     * Export report from API based on selected filters
     */
    public export() {
        this.loading = true;
        this.actionPointService.exportActionPoints(this.lastTableChangeEvent, this.additionalFilters, this.projectEventService.instant.id)
            .pipe(finalize(() => this.loading = false))
            .subscribe((response) => {
                const contentDisposition = response.headers.get('Content-Disposition');
                const exportName: string = GetFileNameFromContentDisposition(contentDisposition);
                new FileManager().saveFile(exportName, response.body, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            }, () => {
                this.notificationService.openErrorNotification('error.api');
            });
    }

    /**
     * Navigate to update task screen
     * @param id
     */
    public update(id: number) {
        this.router.navigate(['action-points/edit'], {queryParams: {id}});
    }

    public setTableData(tableChangeEvent?: TableChangeEvent): void {
        if (!tableChangeEvent) {
            tableChangeEvent = this.actionPointTable.reset();
        }
        if (tableChangeEvent && tableChangeEvent.filters && tableChangeEvent.filters.length > 0) {
            this.allActionPointFilters = tableChangeEvent.filters;
        }

        this.lastTableChangeEvent = tableChangeEvent;

        this.additionalFilters = [
            new Filter('PROJECT_ID', this.projectEventService.instant.id, 'NUMBER'),
        ];

        if (this.businessAreaFilter && this.businessAreaFilter.value !== 'all') {
            this.additionalFilters.push(this.businessAreaFilter);
        }

        if (this.allActionPointFilters) {
            this.allActionPointFilters.forEach((filter: Filter) => {
                this.additionalFilters.push(filter);
            });
        }

        this.loading = true;

        // Update table change event values from local storage
        if (!this.isInitialized && this.isReturnFromDetail() && this.tableChangeStorageService.getTasksLastTableChangeEvent()) {
            tableChangeEvent.pageIndex = this.tableChangeStorageService.getTasksLastTableChangeEvent().pageIndex;
            tableChangeEvent.pageSize = this.tableChangeStorageService.getTasksLastTableChangeEvent().pageSize;
            tableChangeEvent.sortDirection = this.tableChangeStorageService.getTasksLastTableChangeEvent().sortDirection;
            tableChangeEvent.sortActive = this.tableChangeStorageService.getTasksLastTableChangeEvent().sortActive;
        }
        this.actionPointService.browseActionPoints(tableChangeEvent, this.additionalFilters)
            .pipe(finalize(() => this.loading = false))
            .subscribe((data) => {
                this.data = data;
                this.isInitialized = true;
            }, () => {
                this.notificationService.openErrorNotification('error.api');
            });

        this.tableChangeStorageService.setTasksLastTableChangeEvent(tableChangeEvent, this.additionalFilters);
    }

    public allowCreateActionPointButton(): boolean {
        return this.hasCreateActionPointRole() || this.hasCreateActionPointRoleInAssignProject();
    }

    public allowExportReportActionPointButton(): boolean {
        return this.hasRoleExportReportActionPoint() || this.hasRoleExportReportActionPointInAssignProject();
    }

    public allowActionPointDetailButton(): boolean {
        return this.authService.hasRole(Role.RoleReadActionPoint) ||
            this.authService.hasRole(Role.RoleReadActionPointInAssignProject) ||
            this.authService.hasRole(Role.RoleUpdateActionPoint) ||
            this.authService.hasRole(Role.RoleUpdateActionPointInAssignProject);
    }

    private hasCreateActionPointRole(): boolean {
        return this.authService.hasRole(Role.RoleCreateActionPoint);
    }

    private hasCreateActionPointRoleInAssignProject(): boolean {
        return this.authService.hasRole(Role.RoleCreateActionPointInAssignProject);
    }

    private hasRoleExportReportActionPoint(): boolean {
        return this.authService.hasRole(Role.RoleExportReportActionPoint);
    }

    private hasRoleExportReportActionPointInAssignProject(): boolean {
        return this.authService.hasRole(Role.RoleExportReportActionPointInAssignProject);
    }

    /**
     * If returned from edit task form or create task form
     */
    private isReturnFromDetail() {
        return this.routingStorageService.getPreviousUrl()
                   .includes('action-points/edit') || this.routingStorageService.getPreviousUrl()
                                                  .includes('action-points/create');
    }
}
