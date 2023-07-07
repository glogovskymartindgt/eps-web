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
import { Role } from '../../../../shared/enums/role.enum';
import { RouteNames } from '../../../../shared/enums/route-names.enum';
import { FactItemType } from '../../../../shared/interfaces/fact-item-type';
import { TagService } from '../../../../shared/services/data/tag.service';
import { RoutingStorageService } from '../../../../shared/services/routing-storage.service';
import { TableChangeStorageService } from '../../../../shared/services/table-change-storage.service';
import { tableLastStickyColumn } from '../../../../shared/utils/table-last-sticky-column';

@Component({
    selector: 'iihf-tags-list',
    templateUrl: './tags-list.component.html',
    styleUrls: ['./tags-list.component.scss'],
    animations: [fadeEnterLeave]
})

export class TagsListComponent implements OnInit {
    @ViewChild('updateColumn', {static: true}) public updateColumn: TemplateRef<HTMLElement>

    public tableConfiguration: TableConfiguration;
    public tableData: BrowseResponse<FactItemType> = new BrowseResponse<FactItemType>();
    public loading = false;
    public readonly roles: typeof Role = Role;

    private additionalFilters: Filter[] = [];

    public constructor(
        private readonly tagService: TagService,
        private readonly router: Router,
        private readonly routingStorageService: RoutingStorageService,
        private readonly tableChangeStorageService: TableChangeStorageService
    ) {
    }

    public ngOnInit(): void {
        this.tableChangeStorageService.isReturnFromDetail = this.isReturnFromDetail();
        this.setTableConfiguration();
    }

    public getData(tableChangeEvent: TableChangeEvent): void {
        this.tableChangeStorageService.cachedTableChangeEvent = tableChangeEvent;

        this.loading = true;
        this.tagService.browseTags(tableChangeEvent, this.additionalFilters)
            .pipe(finalize((): any => this.loading = false))
            .subscribe((data: BrowseResponse<FactItemType>): void => {
                this.tableData = data;
            });
    }

    public goToDetail(factItemType: FactItemType): void {
        this.router.navigate([RouteNames.CODE_LISTS, RouteNames.TAGS, RouteNames.EDIT], {
            queryParams: {
                id: factItemType.id,
            }
        });
    }

    private setTableConfiguration(): void {
        const config: TableConfiguration = {
            columns: [
                new TableColumn({
                    columnDef: 'name',
                    labelKey: 'tags.list.name',
                    filter: new TableColumnFilter({}),
                    sorting: true,
                }),
                new TableColumn({
                    columnDef: 'count',
                    labelKey: 'tags.list.count',
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
        return this.routingStorageService.getPreviousUrl().includes('code-lists/tags/edit')
            || this.routingStorageService.getPreviousUrl().includes('code-lists/tags/create');
    }
}
