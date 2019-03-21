import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { TableCellType, TableColumn, TableColumnFilter, TableConfiguration } from '../../../shared/hazlenut/core-table';
import { BrowseResponse } from '../../../shared/hazlenut/hazelnut-common/models';

@Component({
    selector: 'fact-list',
    templateUrl: './fact-list.component.html',
    styleUrls: ['./fact-list.component.scss']
})
export class FactListComponent implements OnInit {
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
            columns: [
                new TableColumn({
                    columnDef: 'category',
                    label: this.translateService.instant('fact.category'),
                    filter: new TableColumnFilter({}),
                    sorting: true,
                }),
                new TableColumn({
                    columnDef: 'subCategory',
                    label: this.translateService.instant('fact.subCategory'),
                    filter: new TableColumnFilter({}),
                    sorting: true,
                }),
                new TableColumn({
                    columnDef: 'firstVenue',
                    label: this.translateService.instant('fact.firstVenue'),
                    type: TableCellType.NUMBER,
                    sorting: true,
                }),
                new TableColumn({
                    columnDef: 'secondVenue',
                    label: this.translateService.instant('fact.secondVenue'),
                    type: TableCellType.NUMBER,
                    sorting: true,
                }),
                new TableColumn({
                    columnDef: 'totalValue',
                    label: this.translateService.instant('fact.totalValue'),
                    type: TableCellType.NUMBER,
                    sorting: true,
                })
            ],
            paging: true,
        };
    }

    public createFact() {
        this.router.navigate(['facts/create']);
    }

}
