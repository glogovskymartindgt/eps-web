import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
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
import { BrowseResponse } from '../../../shared/hazlenut/hazelnut-common/models';
import { TaskInterface } from '../../../shared/interfaces/task.interface';
import { TaskService } from '../../../shared/services/data/task.service';
import { NotificationService } from '../../../shared/services/notification.service';

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

    private isInitialized = false;
    public loading = false;
    public config: TableConfiguration;
    public data: BrowseResponse<TaskInterface> = new BrowseResponse<TaskInterface>();

    public constructor(private readonly translateService: TranslateService,
                       private readonly router: Router,
                       private readonly taskService: TaskService,
                       private readonly notificationService: NotificationService,
    ) {
    }

    public ngOnInit() {
        this.config = {
            stickyEnd: 8,
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
                new TableColumn({
                    columnDef: 'projectPhase',
                    label: this.translateService.instant('task.phase'),
                    filter: new TableColumnFilter({}),
                    sorting: true,
                }),
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
        this.router.navigate(['tasks/edit']);
    }

    public setTableData(tableChangeEvent?: TableChangeEvent): void {
        this.loading = true;
        this.taskService.browseTasks(tableChangeEvent).subscribe((data) => {
            this.data = data;
            console.log(this.data);
            this.loading = false;
            this.isInitialized = true;
        }, (error) => {
            this.loading = false;
            // this.notificationService.openErrorNotification(error);
        });
    }

}
