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

    public areaGroup: FormGroup;
    public config: TableConfiguration;
    public data: BrowseResponse<TaskInterface> = new BrowseResponse<TaskInterface>();
    public businessAreaList: string[];
    public loading = false;
    private isInitialized = false;
    private businessAreaFilter: Filter;

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
        this.loadBusinessAreaList();
        this.areaGroup = this.formBuilder.group({
            businessArea: [this.selectedAreaService.instant.selectedArea]
        });
        this.areaGroup.valueChanges.subscribe((value) => {
            if (value !== 'all') {
                this.businessAreaFilter = new Filter('BUSENESS_AREA_NAME', value.businessArea);
            }
            this.setTableData();
        });
        this.config = {
            stickyEnd: 7,
            columns: [
                new TableColumn({
                    columnDef: 'trafficLight',
                    label: this.translateService.instant('task.trafficLight'),
                    type: TableCellType.CONTENT,
                    tableCellTemplate: this.trafficLightColumn,
                    filter: new TableColumnFilter({
                        valueType: 'ENUM',
                        type: TableFilterType.TRAFFIC_LIGHT,
                        select: [
                            new ListItem('', this.translateService.instant('all.things')),
                            new ListItem('RED', this.translateService.instant('task.trafficLightValue.red')),
                            new ListItem('GREEN', this.translateService.instant('task.trafficLightValue.green')),
                            new ListItem('AMBER', this.translateService.instant('task.trafficLightValue.amber')),
                        ]
                    }),
                    sorting: true,
                }),
                new TableColumn({
                    columnDef: 'taskType',
                    label: this.translateService.instant('task.type'),
                    sorting: true,
                    type: TableCellType.CONTENT,
                    tableCellTemplate: this.taskTypeColumn,
                    filter: new TableColumnFilter({
                        valueType: 'ENUM',
                        type: TableFilterType.SELECT,
                        select: [
                            new ListItem('', this.translateService.instant('all.things')),
                            new ListItem('TASK', this.translateService.instant('task.taskTypeValue.task')),
                            new ListItem('ISSUE', this.translateService.instant('task.taskTypeValue.issue')),
                        ]
                    }),
                }),
                new TableColumn({
                    columnDef: 'code',
                    label: this.translateService.instant('task.code'),
                    filter: new TableColumnFilter({}),
                    sorting: true,
                }),
                new TableColumn({
                    columnDef: 'name',
                    label: this.translateService.instant('task.name'),
                    filter: new TableColumnFilter({}),
                    sorting: true,
                }),
                // new TableColumn({
                //     columnDef: 'projectPhase',
                //     label: this.translateService.instant('task.phase'),
                //     filter: new TableColumnFilter({}),
                //     sorting: true,
                // }),
                new TableColumn({
                    columnDef: 'cityName',
                    label: this.translateService.instant('task.venue'),
                    filter: new TableColumnFilter({}),
                    sorting: true,
                }),
                new TableColumn({
                    columnDef: 'responsibleUser',
                    label: this.translateService.instant('task.responsible'),
                    filter: new TableColumnFilter({}),
                    sorting: true,
                }),
                new TableColumn({
                    columnDef: 'dueDate',
                    label: this.translateService.instant('task.dueDate'),
                    type: TableCellType.DATETIME,
                    filter: new TableColumnFilter({
                        valueType: 'DATE_TIME',
                        type: TableFilterType.DATETIME_AS_DATERANGE,
                    }),
                    sorting: true,
                }),
                new TableColumn({
                    columnDef: 'state',
                    label: this.translateService.instant('task.status'),
                    type: TableCellType.CONTENT,
                    tableCellTemplate: this.statusColumn,
                    filter: new TableColumnFilter({
                        valueType: 'ENUM',
                        type: TableFilterType.SELECT,
                        select: [
                            new ListItem('', this.translateService.instant('all.things')),
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
    }

    public update(id: number) {
        this.router.navigate(['tasks/edit/'+id]);
    }

    public setTableData(tableChangeEvent?: TableChangeEvent): void {

        const additionalFilters = [
            new Filter('PROJECT_NAME', this.projectEventService.instant.projectName),
            new Filter('PROJECT_YEAR', this.projectEventService.instant.year, 'NUMBER'),
        ];

        if (this.businessAreaFilter && this.businessAreaFilter.value !== 'all') {
            additionalFilters.push(this.businessAreaFilter);
        }

        if (!this.isInitialized) {
            additionalFilters.push(
                this.businessAreaFilter = new Filter('BUSENESS_AREA_NAME',
                    this.selectedAreaService.instant.selectedArea)
            );

        }

        this.loading = true;
        this.taskService.browseTasks(tableChangeEvent, additionalFilters).subscribe((data) => {
            this.data = data;
            this.loading = false;
            this.isInitialized = true;
        }, (error) => {
            this.loading = false;
            // this.notificationService.openErrorNotification(error);

        });
    }

    private loadBusinessAreaList() {
        this.businessAreaService.listBusinessAreas().subscribe((data) => {
            this.businessAreaList = data.content
                .filter((item) => item.codeItem !== null && item.state === 'VALID')
                .map((item) => item.name);
        });
    }

}
