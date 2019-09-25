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
import { StringUtils } from '../../../shared/hazlenut/hazelnut-common/hazelnut';
import { BrowseResponse, Filter } from '../../../shared/hazlenut/hazelnut-common/models';
import { Fact } from '../../../shared/interfaces/fact.interface';
import { FactService } from '../../../shared/services/data/fact.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { RoutingStorageService } from '../../../shared/services/routing-storage.service';
import { ProjectEventService } from '../../../shared/services/storage/project-event.service';
import { TableChangeStorageService } from '../../../shared/services/table-change-storage.service';

const ALL_FACTS = 'all-facts';

@Component({
    selector: 'fact-list',
    templateUrl: './fact-list.component.html',
    styleUrls: ['./fact-list.component.scss']
})

/**
 * Fact list used in screens Facts and Figures | All Facts and Figures
 */
export class FactListComponent implements OnInit {
    @ViewChild('updateColumn') public updateColumn: TemplateRef<any>;
    @ViewChild('firstValueColumn') public firstValueColumn: TemplateRef<any>;
    @ViewChild('secondValueColumn') public secondValueColumn: TemplateRef<any>;
    @ViewChild('totalValueColumn') public totalValueColumn: TemplateRef<any>;
    @ViewChild('categoryColumn') public categoryColumn: TemplateRef<any>;
    public config: TableConfiguration;
    public loading = false;
    public isInitialized = false;
    public data = new BrowseResponse<Fact>([]);
    public allFacts = false;

    public constructor(public readonly projectEventService: ProjectEventService,
                       private readonly translateService: TranslateService,
                       private readonly notificationService: NotificationService,
                       private readonly factService: FactService,
                       private readonly router: Router,
                       private readonly routingStorageService: RoutingStorageService,
                       private readonly tableChangeStorageService: TableChangeStorageService,
    ) {
    }

    public ngOnInit() {
        // Default config for table initialization
        this.config = {
            stickyEnd: 4,
            columns: [
                new TableColumn({
                    columnDef: 'categoryName',
                    labelKey: 'fact.category',
                    type: TableCellType.CONTENT,
                    filter: new TableColumnFilter({
                        type: TableFilterType.CATEGORY,
                    }),
                    sorting: true,
                    tableCellTemplate: this.categoryColumn,
                }),
                new TableColumn({
                    columnDef: 'subCategoryName',
                    labelKey: 'fact.subCategory',
                    filter: new TableColumnFilter({}),
                    sorting: true,
                }),
                new TableColumn({
                    columnDef: 'valueFirst',
                    label: this.projectEventService.instant.firstVenue ? this.projectEventService.instant.firstVenue : '-',
                    align: 'right',
                    type: TableCellType.CONTENT,
                    filter: new TableColumnFilter({
                        type: TableFilterType.NUMBER,
                    }),
                    sorting: true,
                    tableCellTemplate: this.firstValueColumn,
                }),
                new TableColumn({
                    columnDef: 'valueSecond',
                    label: this.projectEventService.instant.secondVenue ? this.projectEventService.instant.secondVenue : '-',
                    align: 'right',
                    type: TableCellType.CONTENT,
                    filter: new TableColumnFilter({
                        type: TableFilterType.NUMBER,
                    }),
                    sorting: true,
                    tableCellTemplate: this.secondValueColumn,
                }),
                new TableColumn({
                    columnDef: 'totalValue',
                    labelKey: 'fact.totalValue',
                    align: 'right',
                    type: TableCellType.CONTENT,
                    filter: new TableColumnFilter({
                        type: TableFilterType.NUMBER,
                    }),
                    sorting: true,
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

        if (!this.isInitialized
            && this.isReturnFromDetail()
            && this.tableChangeStorageService.getFactsLastTableChangeEvent()
        ) {
            if (this.tableChangeStorageService.getFactsLastTableChangeEvent().filters) {
                this.config.predefinedFilters = this.tableChangeStorageService.getFactsLastTableChangeEvent().filters;
            }
            if (this.tableChangeStorageService.getFactsLastTableChangeEvent().pageIndex) {
                this.config.predefinedPageIndex = this.tableChangeStorageService.getFactsLastTableChangeEvent().pageIndex;
            }
            if (this.tableChangeStorageService.getFactsLastTableChangeEvent().pageSize) {
                this.config.predefinedPageSize = this.tableChangeStorageService.getFactsLastTableChangeEvent().pageSize;
            }
            if (this.tableChangeStorageService.getFactsLastTableChangeEvent().sortDirection) {
                this.config.predefinedSortDirection =
                    this.tableChangeStorageService.getFactsLastTableChangeEvent().sortDirection.toLowerCase();
            }
            if (this.tableChangeStorageService.getFactsLastTableChangeEvent().sortActive) {
                this.config.predefinedSortActive = StringUtils.convertSnakeToCamel(
                    this.tableChangeStorageService.getFactsLastTableChangeEvent().sortActive.toLowerCase()
                );
            }
        }
        // Update config for All Facts and Figures screen
        if (this.router.url.includes(ALL_FACTS)) {
            this.config.stickyEnd = 5;
            this.allFacts = true;
            this.config.columns.splice(0, 0,
                new TableColumn({
                    columnDef: 'year',
                    labelKey: 'fact.year',
                    align: 'right',
                    type: TableCellType.NUMBER_SIMPLE,
                    filter: new TableColumnFilter({
                        type: TableFilterType.NUMBER,
                    }),
                    sorting: true,
                })
            );
            this.setLabel('valueFirst', 'fact.firstValue');
            this.setLabel('valueSecond', 'fact.secondValue');
        }

    }

    /**
     * Set column label
     * @param columnName
     * @param replaceLabel
     */
    private setLabel(columnName: string, replaceLabel: string) {
        const index = this.config.columns.findIndex((column) => column.columnDef === columnName);
        this.config.columns[index].label = null;
        this.config.columns[index].labelKey = replaceLabel;
    }

    /**
     * Route to create screen of fact
     */
    public createFact() {
        this.router.navigate(['facts/create']);
    }

    /**
     * Route to edit screen of fact detail
     * @param id
     * @param year
     * @param projectId
     */
    public update(id: number, year: number, projectId: number) {
        if (this.router.url.includes(ALL_FACTS)) {
            this.router.navigate(['all-facts/edit'], {queryParams: {id, projectId, year}});
        } else {
            this.router.navigate(['facts/edit'], {queryParams: {id, projectId}});
        }
    }

    public setTableData(tableChangeEvent?: TableChangeEvent): void {
        this.loading = true;
        let projectFilter = null;
        // Create filter which will be use in Facts and Figures screen API call
        if (!this.router.url.includes(ALL_FACTS)) {
            projectFilter = new Filter('PROJECT_ID', this.projectEventService.instant.id, 'NUMBER');
        }
        // Set paging and sort when initializating table
        if (!this.isInitialized
            && this.isReturnFromDetail()
            && this.tableChangeStorageService.getFactsLastTableChangeEvent()
        ) {
            tableChangeEvent.pageIndex = this.tableChangeStorageService.getFactsLastTableChangeEvent().pageIndex;
            tableChangeEvent.pageSize = this.tableChangeStorageService.getFactsLastTableChangeEvent().pageSize;
            tableChangeEvent.sortDirection = this.tableChangeStorageService.getFactsLastTableChangeEvent().sortDirection;
            tableChangeEvent.sortActive = this.tableChangeStorageService.getFactsLastTableChangeEvent().sortActive;
        }
        // Api call
        this.factService.browseFacts(tableChangeEvent, projectFilter).subscribe((data) => {
            this.data = data;
            this.loading = false;
            this.isInitialized = true;
        }, () => {
            this.loading = false;
            this.notificationService.openErrorNotification('error.api');
        });

        this.tableChangeStorageService.setFactsLastTableChangeEvent(tableChangeEvent);
    }

    /**
     * Function if returned from create or detail screen
     */
    private isReturnFromDetail() {
        return this.routingStorageService.getPreviousUrl().includes('facts/edit')
            || this.routingStorageService.getPreviousUrl().includes('facts/create');
    }

}
