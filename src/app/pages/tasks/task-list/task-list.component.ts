import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {
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
    @ViewChild('dateFilter') public dateFilter: TemplateRef<any>;
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
                    title: 'Application',
                    phase: 'phase',
                    venue: 'Zurich',
                    responsible: 'Cornelia',
                    dueDate: new Date(),
                    status: 'Open',
                },
            ]
        );
        this.config = {
            columns: [
                new TableColumn({
                    columnDef: 'type',
                    label: this.translateService.instant('task.type'),
                    filter: new TableColumnFilter({}),
                    sorting: true,
                }),
                new TableColumn({
                    columnDef: 'trafficLight',
                    label: this.translateService.instant('task.trafficLight'),
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
                    columnDef: 'title',
                    label: this.translateService.instant('task.title'),
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
                    type: TableCellType.DATE,
                    filter: new TableColumnFilter({
                        valueType: 'DATE_TIME',
                        type: TableFilterType.DATE,
                        template: this.dateFilter,
                    }),
                    sorting: true,
                }),
                new TableColumn({
                    columnDef: 'status',
                    label: this.translateService.instant('task.status'),
                    filter: new TableColumnFilter({}),
                    sorting: true,
                }),
                new TableColumn({
                    columnDef: ' ',
                    label: ' ',
                    type: TableCellType.CONTENT,
                    tableCellTemplate: this.updateColumn,
                }),
            ],

            paging: true,
        };
    }

    public createTask() {
        this.router.navigate(['tasks/create']);
    }

    public export() {
        console.log('export');
    }

}
