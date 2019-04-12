import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {
    ListItem,
    TableCellType, TableChangeEvent,
    TableColumn,
    TableColumnFilter,
    TableConfiguration,
    TableFilterType
} from '../../../shared/hazlenut/core-table';
import { fadeEnterLeave } from '../../../shared/hazlenut/hazelnut-common/animations';
import { BrowseResponse, Filter } from '../../../shared/hazlenut/hazelnut-common/models';
import { FileManager } from '../../../shared/hazlenut/hazelnut-common/utils/file-manager';
import { BusinessArea } from '../../../shared/interfaces/bussiness-area.interface';
import { TaskInterface } from '../../../shared/interfaces/task.interface';
import { BusinessAreaService } from '../../../shared/services/data/business-area.service';
import { TaskService } from '../../../shared/services/data/task.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { ProjectEventService } from '../../../shared/services/storage/project-event.service';
import { SelectedAreaService } from '../../../shared/services/storage/selected-area.service';

@Component({
    selector: 'iihf-task-list',
    templateUrl: './task-list.component.html',
    styleUrls: ['./task-list.component.scss'],
    animations: [fadeEnterLeave]
})
export class TaskListComponent implements OnInit {
    @ViewChild('trafficLightColumn') public trafficLightColumn: TemplateRef<any>;
    @ViewChild('statusColumn') public statusColumn: TemplateRef<any>;
    @ViewChild('updateColumn') public updateColumn: TemplateRef<any>;
    @ViewChild('taskTypeColumn') public taskTypeColumn: TemplateRef<any>;
    @ViewChild('userColumn') public userColumn: TemplateRef<any>;
    @ViewChild('dateColumn') public dateColumn: TemplateRef<any>;
    @ViewChild('venueColumn') public venueColumn: TemplateRef<any>;

    public areaGroup: FormGroup;
    public config: TableConfiguration;
    public data: BrowseResponse<TaskInterface> = new BrowseResponse<TaskInterface>();
    public businessAreaList: BusinessArea[];
    public loading = false;
    public loadingExport = false;
    private lastTableChangeEvent: TableChangeEvent;
    private isInitialized = false;
    private businessAreaFilter: Filter;
    private allTaskFilters: Filter[] = [];

    public constructor(private readonly translateService: TranslateService,
                       private readonly router: Router,
                       private readonly taskService: TaskService,
                       private readonly notificationService: NotificationService,
                       public readonly projectEventService: ProjectEventService,
                       public readonly selectedAreaService: SelectedAreaService,
                       public readonly businessAreaService: BusinessAreaService,
                       public readonly formBuilder: FormBuilder,
    ) {
    }

    public ngOnInit() {
        const allThingsKey = 'all.things';
        this.loadBusinessAreaList();
        this.areaGroup = this.formBuilder.group({
            businessArea: [this.selectedAreaService.instant.selectedArea]
        });
        this.areaGroup.valueChanges.subscribe((value) => {
            if (value !== 'all') {
                this.businessAreaFilter = new Filter('BUSINESS_AREA_NAME', value.businessArea);
            }
            this.setTableData();
        });
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
                    filter: new TableColumnFilter({}),
                    sorting: true,
                    type: TableCellType.CONTENT,
                    tableCellTemplate: this.venueColumn,
                }),
                new TableColumn({
                    columnDef: 'responsibleUser',
                    labelKey: 'task.responsible',
                    sorting: true,
                    type: TableCellType.CONTENT,
                    tableCellTemplate: this.userColumn,
                    filter: new TableColumnFilter({
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
    }

    public createTask() {
        this.router.navigate(['tasks/create']);
    }

    public export() {
        this.loadingExport = true;
        this.taskService.exportTasks(this.lastTableChangeEvent).subscribe((response) => {
            // TODO create loading on export and add filename as in response
            new FileManager().saveFile(
                'Export',
                response,
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            );
            this.loadingExport = false;
        }, (error) => {
            this.notificationService.openErrorNotification('error.api');
            this.loadingExport = false;
        });
    }

    public update(id: number) {
        this.router.navigate(['tasks/edit'], {queryParams: {id}});
    }

    public setTableData(tableChangeEvent?: TableChangeEvent): void {

        if (tableChangeEvent && tableChangeEvent.filters && tableChangeEvent.filters.length > 0) {
            this.allTaskFilters = tableChangeEvent.filters;
        }

        this.lastTableChangeEvent = tableChangeEvent;
        const additionalFilters = [
            new Filter('PROJECT_NAME', this.projectEventService.instant.projectName),
            new Filter('PROJECT_YEAR', this.projectEventService.instant.year, 'NUMBER'),
        ];

        if (this.businessAreaFilter && this.businessAreaFilter.value !== 'all') {
            additionalFilters.push(this.businessAreaFilter);
        }

        if (!this.isInitialized) {
            additionalFilters.push(
                this.businessAreaFilter = new Filter('BUSINESS_AREA_NAME',
                    this.selectedAreaService.instant.selectedArea)
            );
        }

        if (this.allTaskFilters) {
            this.allTaskFilters.forEach((filter: Filter) => {
                additionalFilters.push(filter);
            });
        }

        this.loading = true;
        this.taskService.browseTasks(tableChangeEvent, additionalFilters).subscribe((data) => {
            this.data = data;
            this.loading = false;
            this.isInitialized = true;
        }, (error) => {
            this.loading = false;
            this.notificationService.openErrorNotification('error.api');

        });
    }

    private loadBusinessAreaList() {
        this.businessAreaService.listBusinessAreas().subscribe((data) => {
            this.businessAreaList = data.content
                .filter((item) => item.codeItem !== null && item.state === 'VALID');
        });
    }

}
