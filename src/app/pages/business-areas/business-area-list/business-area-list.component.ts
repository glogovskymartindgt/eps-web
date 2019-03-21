import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { TableCellType, TableColumn, TableColumnFilter, TableConfiguration } from '../../../shared/hazlenut/core-table';
import { BrowseResponse } from '../../../shared/hazlenut/hazelnut-common/models';

@Component({
    selector: 'business-area-list',
    templateUrl: './business-area-list.component.html',
    styleUrls: ['./business-area-list.component.scss']
})
export class BusinessAreaListComponent implements OnInit {
    @ViewChild('expandedContent') public expandedContent: TemplateRef<any>;
    @ViewChild('navigationToTasksColumn') public navigationToTasksColumn: TemplateRef<any>;
    public config: TableConfiguration;
    public data  = new BrowseResponse<any>(
        [
            {
                code: '1',
                name: 'area1'
            },
            {
                code: '2',
                name: 'area2'
            },
            {
                code: '3',
                name: 'area3'
            },
            {
                code: '4',
                name: 'area4'
            },
            {
                code: '5',
                name: 'area5'
            },
            {
                code: '6',
                name: 'area6'
            },
        ]
    );

    public constructor(private readonly translateService: TranslateService,
                       private readonly router: Router,
    ) {
    }

    public ngOnInit() {
        this.config = {
            columns: [
                new TableColumn({
                    columnDef: 'code',
                    label: this.translateService.instant('businessArea.code'),
                    filter: new TableColumnFilter({}),
                    sorting: true,
                }),
                new TableColumn({
                    columnDef: 'name',
                    label: this.translateService.instant('businessArea.name'),
                    filter: new TableColumnFilter({}),
                    sorting: true,
                }),
                new TableColumn({
                    columnDef: ' ',
                    label: ' ',
                    type: TableCellType.CONTENT,
                    tableCellTemplate: this.navigationToTasksColumn,
                }),
            ],
            paging: true,
        };
    }

    public showTasks() {
        this.router.navigate(['tasks/list']);
    }

}
