import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {
    ListItem,
    TableCellType,
    TableColumn,
    TableColumnFilter,
    TableConfiguration,
    TableFilterType
} from '../../../shared/hazlenut/core-table';
import { fadeEnterLeave } from '../../../shared/hazlenut/hazelnut-common/animations';
import { BrowseResponse } from '../../../shared/hazlenut/hazelnut-common/models';

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
    public config: TableConfiguration;
    public data;

    public constructor(private readonly translateService: TranslateService,
                       private readonly router: Router) {
    }

    public ngOnInit() {
        this.data = new BrowseResponse<any>(
            [
                {
                    type: 'Task',
                    trafficLight: 'green',
                    code: '1.1.1',
                    name: 'Application',
                    phase: 'phase',
                    venue: 'Zurich',
                    responsible: 'Cornelia',
                    dueDate: new Date(),
                    status: 'Open',
                },
            ]
        );
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
                    columnDef: 'type',
                    label: this.translateService.instant('task.type'),
                    filter: new TableColumnFilter({}),
                    sorting: true,
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
                    columnDef: 'phase',
                    label: this.translateService.instant('task.phase'),
                    filter: new TableColumnFilter({}),
                    sorting: true,
                }),
                new TableColumn({
                    columnDef: 'venue',
                    label: this.translateService.instant('task.venue'),
                    filter: new TableColumnFilter({}),
                    sorting: true,
                }),
                new TableColumn({
                    columnDef: 'responsible',
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
                    columnDef: 'status',
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

}
