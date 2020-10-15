import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { finalize } from 'rxjs/operators';
import { Role } from '../../../shared/enums/role.enum';
import {
    TableCellType,
    TableChangeEvent,
    TableColumn,
    TableColumnFilter,
    TableConfiguration,
    TableFilterType
} from '../../../shared/hazelnut/core-table';
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
import { tableLastStickyColumn } from '../../../shared/utils/table-last-sticky-column';

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
    public data = new BrowseResponse<Fact>([]);
    public allFacts = false;
    public role: typeof Role = Role;

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
        this.tableChangeStorageService.isReturnFromDetail = this.isReturnFromDetail();
        this.setTableConfiguration();
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

        this.tableChangeStorageService.cachedTableChangeEvent = tableChangeEvent;
        this.lastTableChangeEvent = tableChangeEvent;
        // Api call
        this.factService.browseFacts(tableChangeEvent, projectFilter)
            .pipe(finalize((): any => this.loading = false))
            .subscribe((data: BrowseResponse<Fact>): void => {
                this.data = data;
            }, (): void => {
                this.notificationService.openErrorNotification('error.api');
            });
    }

    public allowCreateFactButton(): boolean {
        return this.hasRoleCreateFactItem() || this.hasRoleCreateFactItemInAssignProject();
    }

    public factDetailRoles(): Role[] {
        if (this.allFacts) {
            return [
                Role.RoleReadAllFactItem,
                Role.RoleReadAllFactItemInAssignProject,
            ];
            // tslint:disable-next-line:unnecessary-else
        } else {
            return [
                Role.RoleReadFactItem,
                Role.RoleReadFactItemInAssignProject,
                Role.RoleUpdateFactItem,
                Role.RoleUpdateFactItemInAssignProject,
            ];
        }
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

    private setTableConfiguration(): void {
        let config: TableConfiguration = {
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
                    columnDef: 'descriptionShort',
                    labelKey: 'fact.description',
                    columnRequestName: 'description',
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

        config = this.tableChangeStorageService.updateTableConfiguration(config);

        // Update config for All Facts and Figures screen
        if (this.router.url.includes(ALL_FACTS)) {
            this.allFacts = true;
            config.columns.splice(0, 0, new TableColumn({
                columnDef: 'year',
                labelKey: 'fact.year',
                align: 'right',
                type: TableCellType.NUMBER_SIMPLE,
                filter: new TableColumnFilter({
                    type: TableFilterType.NUMBER,
                }),
                sorting: true,
            }));
            this.setLabel(config, 'valueFirst', 'fact.firstValue');
            this.setLabel(config, 'valueSecond', 'fact.secondValue');
        }

        config.stickyEnd = tableLastStickyColumn(config.columns.length);
        this.config = config;
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

    /**
     * Set column label
     * @param columnName
     * @param replaceLabel
     */
    private setLabel(config: TableConfiguration, columnName: string, replaceLabel: string): void {
        const index = config.columns.findIndex((column: TableColumn): any => column.columnDef === columnName);
        config.columns[index].label = null;
        config.columns[index].labelKey = replaceLabel;
    }

    /**
     * Function if returned from create or detail screen
     */
    private isReturnFromDetail(): boolean {
        return this.routingStorageService.getPreviousUrl().includes('facts/edit')
            || this.routingStorageService.getPreviousUrl().includes('facts/create');
    }

}
