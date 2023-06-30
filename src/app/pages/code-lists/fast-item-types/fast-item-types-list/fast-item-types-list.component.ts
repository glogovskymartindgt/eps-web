import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {
    BrowseResponse,
    fadeEnterLeave,
    Filter,
    ListItem,
    TableCellType,
    TableChangeEvent,
    TableColumn,
    TableColumnFilter,
    TableConfiguration,
    TableFilterType
} from '@hazelnut';
import { TranslateService } from '@ngx-translate/core';
import { finalize } from 'rxjs/operators';
import { State } from '../../../../shared/enums/enumerators';
import { RequestNames } from '../../../../shared/enums/request-names.enum';
import { Role } from '../../../../shared/enums/role.enum';
import { RouteNames } from '../../../../shared/enums/route-names.enum';
import { FactItemType } from '../../../../shared/interfaces/fact-item-type';
import { FactItemTypeService } from '../../../../shared/services/data/factItemType.service';
import { RoutingStorageService } from '../../../../shared/services/routing-storage.service';
import { ProjectEventService } from '../../../../shared/services/storage/project-event.service';
import { TableChangeStorageService } from '../../../../shared/services/table-change-storage.service';
import { tableLastStickyColumn } from '../../../../shared/utils/table-last-sticky-column';

@Component({
    selector: 'iihf-fast-item-types-list',
    templateUrl: './fast-item-types-list.component.html',
    styleUrls: ['./fast-item-types-list.component.scss'],
    animations: [fadeEnterLeave]
})

export class FastItemTypesListComponent implements OnInit {
    @ViewChild('updateColumn', {static: true}) public updateColumn: TemplateRef<HTMLElement>

    public tableConfiguration: TableConfiguration;
    public tableData: BrowseResponse<FactItemType> = new BrowseResponse<FactItemType>();
    public loading = false;
    public readonly roles: typeof Role = Role;

    private additionalFilters: Filter[] = [
        new Filter('FK_PROJECT', this.projectEventService.instant.id, 'NUMBER')
    ];

    public constructor(
        private readonly projectEventService: ProjectEventService,
        private readonly factItemTypeService: FactItemTypeService,
        private readonly router: Router,
        private readonly routingStorageService: RoutingStorageService,
        private readonly tableChangeStorageService: TableChangeStorageService,
        private readonly translateService: TranslateService
    ) {
    }

    public ngOnInit(): void {
        this.tableChangeStorageService.isReturnFromDetail = this.isReturnFromDetail();
        this.setTableConfiguration();
    }

    public getData(tableChangeEvent: TableChangeEvent): void {
        this.tableChangeStorageService.cachedTableChangeEvent = tableChangeEvent;

        this.loading = true;
        this.factItemTypeService.browseFactItemTypes(tableChangeEvent, this.additionalFilters)
            .pipe(finalize((): any => this.loading = false))
            .subscribe((data: BrowseResponse<FactItemType>): void => {
                this.tableData = data;
            });
    }

    public createFactItemType(): void {
        this.router.navigate([RouteNames.CODE_LISTS, RouteNames.FACT_ITEM_TYPES, RouteNames.CREATE]);
    }

    public goToDetail(factItemType: FactItemType): void {
        this.router.navigate([RouteNames.CODE_LISTS, RouteNames.FACT_ITEM_TYPES, RouteNames.EDIT], {
            queryParams: {
                id: factItemType.id,
            }
        });
    }

    private setTableConfiguration(): void {
        const config: TableConfiguration = {
            columns: [
                new TableColumn({
                    columnDef: 'categoryName',
                    labelKey: 'factItemTypes.list.category',
                    columnRequestName: RequestNames.CATEGORY,
                    filter: new TableColumnFilter({
                        type: TableFilterType.CATEGORY
                    }),
                    sorting: true,
                }),
                new TableColumn({
                    columnDef: 'factItemType',
                    labelKey: 'factItemTypes.list.factItemType',
                    filter: new TableColumnFilter({}),
                    sorting: true,
                }),
                new TableColumn({
                    columnDef: 'measureUnitName',
                    labelKey: 'factItemTypes.list.measurementUnit',
                    columnRequestName: RequestNames.MEASUREMENT_UNIT,
                    filter: new TableColumnFilter({
                        type: TableFilterType.MEASURE_UNIT,
                        valueType: 'STRING',
                    }),
                    sorting: true,
                }),
                new TableColumn({
                    columnDef: 'state',
                    labelKey: 'factItemTypes.list.status',
                    columnRequestName: RequestNames.IS_ACTIVE,
                    filter: new TableColumnFilter({
                        type: TableFilterType.SELECT,
                        select: [
                            new ListItem('', this.translateService.instant('all.things')),
                            new ListItem(State.ACTIVE, this.translateService.instant('factItemTypes.list.active')),
                            new ListItem(State.INACTIVE, this.translateService.instant('factItemTypes.list.inactive')),
                        ],
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
            predefinedSortActive: RequestNames.CATEGORY,
            predefinedSortDirection: 'asc',
            trClasses: 'clickable'
        };

        config.stickyEnd = tableLastStickyColumn(config.columns.length);
        this.tableConfiguration = this.tableChangeStorageService.updateTableConfiguration(config);
    }

    /**
     * If returned from edit task form or create task form
     */
    private isReturnFromDetail(): any {
        return this.routingStorageService.getPreviousUrl().includes('guidelines/edit')
            || this.routingStorageService.getPreviousUrl().includes('guidelines/create');
    }

}
