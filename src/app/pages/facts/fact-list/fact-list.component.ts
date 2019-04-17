import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {
    TableCellType, TableChangeEvent,
    TableColumn,
    TableColumnFilter,
    TableConfiguration,
    TableFilterType
} from '../../../shared/hazlenut/core-table';
import { BrowseResponse } from '../../../shared/hazlenut/hazelnut-common/models';
import { Fact } from '../../../shared/interfaces/fact.interface';
import { FactService } from '../../../shared/services/data/fact.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { ProjectEventService } from '../../../shared/services/storage/project-event.service';

@Component({
    selector: 'fact-list',
    templateUrl: './fact-list.component.html',
    styleUrls: ['./fact-list.component.scss']
})
export class FactListComponent implements OnInit {
    @ViewChild('updateColumn') public updateColumn: TemplateRef<any>;
    @ViewChild('totalValueColumn') public totalValueColumn: TemplateRef<any>;
    public config: TableConfiguration;
    public loading = false;
    public isInitialized = false;
    public data = new BrowseResponse<Fact>([]);

    public constructor(
        private readonly translateService: TranslateService,
        private readonly notificationService: NotificationService,
        private readonly projectEventService: ProjectEventService,
        private readonly factService: FactService,
        private readonly router: Router,
    ) {
    }

    public ngOnInit() {
        this.config = {
            stickyEnd: 4,
            columns: [
                new TableColumn({
                    columnDef: 'category.category',
                    labelKey: 'fact.category',
                    filter: new TableColumnFilter({}),
                    sorting: true,
                }),
                new TableColumn({
                    columnDef: 'subCategory.subCategory',
                    labelKey: 'fact.subCategory',
                    filter: new TableColumnFilter({}),
                    sorting: true,
                }),
                new TableColumn({
                    columnDef: 'valueFirst',
                    label: this.projectEventService.instant.firstVenue,
                    type: TableCellType.NUMBER,
                    filter: new TableColumnFilter({
                        type: TableFilterType.NUMBER,
                    }),
                    sorting: true,
                }),
                new TableColumn({
                    columnDef: 'valueSecond',
                    label: this.projectEventService.instant.secondVenue,
                    type: TableCellType.NUMBER,
                    filter: new TableColumnFilter({
                        type: TableFilterType.NUMBER,
                    }),
                    sorting: true,
                }),
                new TableColumn({
                    columnDef: 'totalValue',
                    labelKey: 'fact.totalValue',
                    align: 'right',
                    type: TableCellType.CONTENT,
                    tableCellTemplate: this.totalValueColumn,
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

    public update(id: number) {
        this.router.navigate(['facts/edit'], {queryParams: {id}});
    }

    public setTableData(tableChangeEvent?: TableChangeEvent): void {
        this.loading = true;
        this.factService.browseFacts(tableChangeEvent).subscribe((data) => {
            this.data = data;
            this.loading = false;
            this.isInitialized = true;
        }, (error) => {
            this.loading = false;
            this.notificationService.openErrorNotification('error.api');
        });
    }
}
