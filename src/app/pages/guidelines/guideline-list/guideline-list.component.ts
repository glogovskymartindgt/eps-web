import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {
    BrowseResponse,
    fadeEnterLeave,
    Filter,
    TableCellType,
    TableChangeEvent,
    TableColumn,
    TableColumnFilter,
    TableConfiguration,
    TableFilterType
} from '@hazelnut';
import { finalize } from 'rxjs/operators';
import { RequestNames } from '../../../shared/enums/request-names.enum';
import { Role } from '../../../shared/enums/role.enum';
import { RouteNames } from '../../../shared/enums/route-names.enum';
import { Guideline } from '../../../shared/interfaces/guideline.interface';
import { TableContainer } from '../../../shared/interfaces/table-container.interface';
import { GuideLineService } from '../../../shared/services/data/guideline.service';
import { RoutingStorageService } from '../../../shared/services/routing-storage.service';
import { ProjectEventService } from '../../../shared/services/storage/project-event.service';
import { TableChangeStorageService } from '../../../shared/services/table-change-storage.service';
import { tableLastStickyColumn } from '../../../shared/utils/table-last-sticky-column';

@Component({
    selector: 'iihf-guideline-list',
    templateUrl: './guideline-list.component.html',
    styleUrls: ['./guideline-list.component.scss'],
    animations: [fadeEnterLeave]
})
export class GuidelineListComponent implements OnInit, TableContainer<Guideline> {
    @ViewChild('updateColumn', {static: true})
    public updateColumn: TemplateRef<HTMLElement>;

    public tableConfiguration: TableConfiguration;
    public tableData: BrowseResponse<Guideline> = new BrowseResponse<Guideline>();
    public loading = false;
    public readonly roles: typeof Role = Role;

    private additionalFilters: Filter[] = [];

    public constructor(
        private readonly projectEventService: ProjectEventService,
        private readonly guideLineService: GuideLineService,
        private readonly router: Router,
        private readonly routingStorageService: RoutingStorageService,
        private readonly tableChangeStorageService: TableChangeStorageService,
    ) {
    }

    public ngOnInit(): void {
        this.additionalFilters = [
            new Filter('PROJECT_ID', this.projectEventService.instant.id, 'NUMBER'),
        ];

        this.tableChangeStorageService.isReturnFromDetail = this.isReturnFromDetail();
        this.setTableConfiguration();
    }

    public getData(tableChangeEvent: TableChangeEvent): void {
        this.tableChangeStorageService.cachedTableChangeEvent = tableChangeEvent;

        this.loading = true;
        this.guideLineService.browseGuidelines(tableChangeEvent, this.additionalFilters)
            .pipe(finalize((): any => this.loading = false))
            .subscribe((data: BrowseResponse<Guideline>): void => {
                this.tableData = data;
            });
    }

    public createGuideline(): void {
        this.router.navigate([RouteNames.GUIDELINES, RouteNames.CREATE]);
    }

    public goToDetail(guideline: Guideline): void {
        this.router.navigate([RouteNames.GUIDELINES, RouteNames.EDIT, guideline.id]);
    }

    public isOpenProject(): boolean {
        return this.projectEventService.instant.active;
    }

    private setTableConfiguration(): void {
        const config: TableConfiguration = {
            columns: [
                new TableColumn({
                    columnDef: 'clBusinessArea.codeItem',
                    labelKey: 'guidelines.list.businessAreaCode',
                    columnRequestName: RequestNames.BUSINESS_AREA_CODE,
                    type: TableCellType.NUMBER,
                    filter: new TableColumnFilter({
                        type: TableFilterType.NUMBER,
                    }),
                    sorting: true,
                }),
                new TableColumn({
                    columnDef: 'clBusinessArea.name',
                    labelKey: 'guidelines.list.businessAreaName',
                    columnRequestName: RequestNames.BUSINESS_AREA_NAME,
                    filter: new TableColumnFilter({}),
                    sorting: true,
                }),
                new TableColumn({
                    columnDef: 'title',
                    labelKey: 'guidelines.list.actionPointTitle',
                    filter: new TableColumnFilter({}),
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
            predefinedSortActive: 'clBusinessArea.codeItem',
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
