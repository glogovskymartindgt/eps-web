import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { finalize } from 'rxjs/operators';
import { Role } from '../../../shared/enums/role.enum';
import { TableCellType, TableChangeEvent, TableColumn, TableColumnFilter, TableConfiguration, TableFilterType } from '../../../shared/hazelnut/core-table';
import { StringUtils } from '../../../shared/hazelnut/hazelnut-common/hazelnut';
import { BrowseResponse, Filter } from '../../../shared/hazelnut/hazelnut-common/models';
import { FileManager } from '../../../shared/hazelnut/hazelnut-common/utils/file-manager';
import { Fact } from '../../../shared/interfaces/fact.interface';
import { AuthService } from '../../../shared/services/auth.service';
import { FactService } from '../../../shared/services/data/fact.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { RoutingStorageService } from '../../../shared/services/routing-storage.service';
import { ProjectEventService } from '../../../shared/services/storage/project-event.service';
import { TableChangeStorageService } from '../../../shared/services/table-change-storage.service';
import { GetFileNameFromContentDisposition } from '../../../shared/utils/headers';

const ALL_FACTS = 'all-facts';

@Component({
    selector: 'iihf-fact-list',
    templateUrl: './fact-list.component.html',
    styleUrls: ['./fact-list.component.scss']
})

/**
 * Fact list used in screens Facts and Figures | All Facts and Figures
 */

export class FactListComponent implements OnInit {
    @ViewChild('updateColumn', {static: true}) public updateColumn: TemplateRef<any>;
    @ViewChild('firstValueColumn', {static: true}) public firstValueColumn: TemplateRef<any>;
    @ViewChild('secondValueColumn', {static: true}) public secondValueColumn: TemplateRef<any>;
    @ViewChild('totalValueColumn', {static: true}) public totalValueColumn: TemplateRef<any>;
    @ViewChild('categoryColumn', {static: true}) public categoryColumn: TemplateRef<any>;
    public config: TableConfiguration;
    public loading = false;
    public isInitialized = false;
    public data = new BrowseResponse<Fact>([]);
    public allFacts = false;

    private lastTableChangeEvent: TableChangeEvent;
    private allTaskFilters: Filter[] = [];

    public constructor(public readonly projectEventService: ProjectEventService,
                       private readonly translateService: TranslateService,
                       private readonly notificationService: NotificationService,
                       private readonly factService: FactService,
                       public readonly router: Router,
                       private readonly routingStorageService: RoutingStorageService,
                       private readonly tableChangeStorageService: TableChangeStorageService,
                       private readonly authService: AuthService) {
    }

    public ngOnInit(): void {
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
                    label: this.checkValue(this.projectEventService.instant.firstVenue),
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
                    label: this.checkValue(this.projectEventService.instant.secondVenue),
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

        if (!this.isInitialized && this.isReturnFromDetail() && this.tableChangeStorageService.getFactsLastTableChangeEvent()) {
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
                this.config.predefinedSortDirection = this.tableChangeStorageService.getFactsLastTableChangeEvent()
                                                          .sortDirection
                                                          .toLowerCase();
            }
            if (this.tableChangeStorageService.getFactsLastTableChangeEvent().sortActive) {
                this.config.predefinedSortActive = StringUtils.convertSnakeToCamel(this.tableChangeStorageService.getFactsLastTableChangeEvent()
                                                                                       .sortActive
                                                                                       .toLowerCase());
            }
        }
        // Update config for All Facts and Figures screen
        const columnsStickyEndStart = 5;
        if (this.router.url.includes(ALL_FACTS)) {
            this.config.stickyEnd = columnsStickyEndStart;
            this.allFacts = true;
            this.config.columns.splice(0, 0, new TableColumn({
                columnDef: 'year',
                labelKey: 'fact.year',
                align: 'right',
                type: TableCellType.NUMBER_SIMPLE,
                filter: new TableColumnFilter({
                    type: TableFilterType.NUMBER,
                }),
                sorting: true,
            }));
            this.setLabel('valueFirst', 'fact.firstValue');
            this.setLabel('valueSecond', 'fact.secondValue');
        }
    }

    /**
     * Route to create screen of fact
     */
    public createFact(): void {
        this.router.navigate(['facts/create']);
    }

    /**
     * Route to edit screen of fact detail
     * @param id
     * @param year
     * @param projectId
     */
    public update(id: number, year: number, projectId: number): void {
        if (this.router.url.includes(ALL_FACTS)) {
            this.router.navigate(['all-facts/edit'], {
                queryParams: {
                    id,
                    projectId,
                    year
                }
            });
        } else {
            this.router.navigate(['facts/edit'], {
                queryParams: {
                    id,
                    projectId
                }
            });
        }
    }

    public setTableData(tableChangeEvent?: TableChangeEvent): void {
        this.loading = true;
        let projectFilter = null;
        // Create filter which will be use in Facts and Figures screen API call
        if (!this.router.url.includes(ALL_FACTS)) {
            projectFilter = new Filter('PROJECT_ID', this.projectEventService.instant.id, 'NUMBER');
        }

        if (tableChangeEvent && tableChangeEvent.filters && tableChangeEvent.filters.length > 0) {
            this.allTaskFilters = tableChangeEvent.filters;
        }

        // Set paging and sort when initializating table
        if (!this.isInitialized && this.isReturnFromDetail() && this.tableChangeStorageService.getFactsLastTableChangeEvent()) {
            tableChangeEvent.pageIndex = this.tableChangeStorageService.getFactsLastTableChangeEvent().pageIndex;
            tableChangeEvent.pageSize = this.tableChangeStorageService.getFactsLastTableChangeEvent().pageSize;
            tableChangeEvent.sortDirection = this.tableChangeStorageService.getFactsLastTableChangeEvent().sortDirection;
            tableChangeEvent.sortActive = this.tableChangeStorageService.getFactsLastTableChangeEvent().sortActive;
        }
        // Api call
        this.factService.browseFacts(tableChangeEvent, projectFilter)
            .pipe(finalize((): any => this.loading = false))
            .subscribe((data: BrowseResponse<Fact>): void => {
                this.data = data;
                this.isInitialized = true;
            }, (): void => {
                this.notificationService.openErrorNotification('error.api');
            });

        this.tableChangeStorageService.setFactsLastTableChangeEvent(tableChangeEvent);
        this.lastTableChangeEvent = tableChangeEvent;
    }

    public allowCreateFactButton(): boolean {
        return this.hasRoleCreateFactItem() || this.hasRoleCreateFactItemInAssignProject();
    }

    public allowExportAllFactItemButton(): boolean {
        return this.allFacts && this.hasRoleExportAllFactItem();
    }

    public allowFactDetailButton(): boolean {
        return (!this.allFacts &&
            (this.authService.hasRole(Role.RoleReadFactItem) ||
                this.authService.hasRole(Role.RoleReadFactItemInAssignProject) ||
                this.authService.hasRole(Role.RoleUpdateFactItem) ||
                this.authService.hasRole(Role.RoleUpdateFactItemInAssignProject))) || (this.allFacts && this.authService.hasRole(Role.RoleReadAllFactItem));
    }

    /**
     * Export report from API based on selected filters
     */
    public export(): void {
        this.loading = true;
        this.factService.exportTasks(this.lastTableChangeEvent, this.allTaskFilters, this.projectEventService.instant.id)
            .pipe(finalize((): any => this.loading = false))
            .subscribe((response: HttpResponse<any>): void => {
                const contentDisposition = response.headers.get('Content-Disposition');
                const exportName: string = GetFileNameFromContentDisposition(contentDisposition);
                new FileManager().saveFile(exportName, response.body, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            }, (): void => {
                this.notificationService.openErrorNotification('error.api');
            });
    }

    private checkValue(value: any): any {
        return value ? value : '-';
    }

    private hasRoleCreateFactItem(): boolean {
        return this.authService.hasRole(Role.RoleCreateFactItem);
    }

    private hasRoleCreateFactItemInAssignProject(): boolean {
        return this.authService.hasRole(Role.RoleCreateFactItemInAssignProject);
    }

    private hasRoleExportAllFactItem(): boolean {
        return this.authService.hasRole(Role.RoleExportAllFactItem);
    }

    /**
     * Set column label
     * @param columnName
     * @param replaceLabel
     */
    private setLabel(columnName: string, replaceLabel: string): void {
        const index = this.config.columns.findIndex((column: TableColumn): any => column.columnDef === columnName);
        this.config.columns[index].label = null;
        this.config.columns[index].labelKey = replaceLabel;
    }

    /**
     * Function if returned from create or detail screen
     */
    private isReturnFromDetail(): boolean {
        return this.routingStorageService.getPreviousUrl()
                   .includes('facts/edit') || this.routingStorageService.getPreviousUrl()
                                                  .includes('facts/create');
    }

}
