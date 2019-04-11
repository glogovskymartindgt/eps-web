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
import { BrowseResponse } from '../../../shared/hazlenut/hazelnut-common/models';

@Component({
    selector: 'fact-list',
    templateUrl: './fact-list.component.html',
    styleUrls: ['./fact-list.component.scss']
})
export class FactListComponent implements OnInit {
    @ViewChild('updateColumn') public updateColumn: TemplateRef<any>;
    public config: TableConfiguration;
    public data = new BrowseResponse<any>(
        [
            {
                category: 'category1',
                subCategory: 'subCategory1',
                firstVenue: 345235,
                secondVenue: 3,
                totalValue: 4325235423
            },
            {
                category: 'category2',
                subCategory: 'subCategory2',
                firstVenue: 234523,
                secondVenue: 423,
                totalValue: 33
            }
        ]);

    public constructor(
        private readonly translateService: TranslateService,
        private readonly router: Router,
    ) {
    }

    public ngOnInit() {
        this.config = {
            stickyEnd: 4,
            columns: [
                new TableColumn({
                    columnDef: 'category',
                    labelKey: 'fact.category',
                    filter: new TableColumnFilter({}),
                    sorting: true,
                }),
                new TableColumn({
                    columnDef: 'subCategory',
                    labelKey: 'fact.subCategory',
                    filter: new TableColumnFilter({}),
                    sorting: true,
                }),
                new TableColumn({
                    columnDef: 'firstVenue',
                    labelKey: 'fact.firstVenue',
                    type: TableCellType.NUMBER,
                    sorting: true,
                }),
                new TableColumn({
                    columnDef: 'secondVenue',
                    labelKey: 'fact.secondVenue',
                    type: TableCellType.NUMBER,
                    sorting: true,
                }),
                new TableColumn({
                    columnDef: 'totalValue',
                    labelKey: 'fact.totalValue',
                    type: TableCellType.NUMBER,
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

    public createFact() {
        this.router.navigate(['facts/create']);
    }

    public update() {
        this.router.navigate(['facts/edit']);
    }
}
