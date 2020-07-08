import { SelectionChange, SelectionModel } from '@angular/cdk/collections';
import { Component, EventEmitter, Inject, Input, OnChanges, OnDestroy, OnInit, Output, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, SortDirection } from '@angular/material/sort';
import { Observable, of, ReplaySubject, Subject } from 'rxjs';
import { map, switchMap, take, takeUntil } from 'rxjs/operators';
import { Error } from 'tslint/lib/error';
import { detailExpand } from '../../hazelnut-common/animations';
import { MiscUtils } from '../../hazelnut-common/hazelnut';
import { TRANSLATE_WRAPPER_TOKEN, TranslateWrapper } from '../../hazelnut-common/interfaces';
import { Filter, Property } from '../../hazelnut-common/models';
import { NOTIFICATION_WRAPPER_TOKEN, NotificationWrapper } from '../../small-components/notifications';
import { CoreTableService } from '../core-table.service';
import { ExpandedDetailDirective } from '../directives/expanded-detail.directive';
import { TableCellType } from '../models/table-cell-type.enum';
import { TableColumn } from '../models/table-column.model';
import { TableConfiguration } from '../models/table-configuration.model';
import { TableRequestParameters } from '../models/table-request-parameters.model';
import { TableResponse } from '../models/table-response.model';
import { FilterMap, TableChangeType } from '../table-change-event';
import { TableChangeEvent } from './../table-change-event';
import { CoreTableFilterComponent } from './core-table-filter/core-table-filter.component';

const DEFAULT_NO_DATA_KEY = 'common.noData';

@Component({
    selector: 'haz-core-table',
    templateUrl: './core-table.component.html',
    styleUrls: ['./core-table.component.scss'],
    animations: [detailExpand],
    providers: [CoreTableService],
})
export class CoreTableComponent<T = any> implements OnInit, OnChanges, OnDestroy {

    public get filtersRowDisplayed(): boolean {
        return this.configuration && this.configuration.columns && this.anyFilter;
    }

    public get displayedColumns(): string[] {
        return this.configuration && this.configuration.columns.map((row: TableColumn) => row.columnDef);
    }

    public get columnsFilters(): string[] {
        return this.configuration && this.configuration.columns.map((row: TableColumn) => row.filterElement);
    }

    public get anyFilter(): boolean {
        return (this.configuration && this.configuration.columns && this.configuration.columns.some((row: TableColumn) => row.filter && row.filter.enabled));
    }

    public get dataRowsDisplayed(): boolean {
        return this.data && this.data.content && this.data.content.length > 0;
    }

    public get selectableTable(): boolean {
        return this.configuration.selection && this.configuration.selection !== 'none';
    }

    public get paginatorHidden(): boolean {
        if (!this.configuration || !this.data || !this.configuration.paging) {
            return true;
        }

        return this.configuration.pageSizeOptions && this.data.totalElements < this.configuration.pageSizeOptions[0];
    }
    public toggle = true;

    @Input() public configuration: TableConfiguration = new TableConfiguration();
    @Input() public data: TableResponse<T>;

    @Output() public readonly requestData: EventEmitter<TableChangeEvent> = new EventEmitter<TableChangeEvent>(true);
    @Output() public readonly selectionChange: EventEmitter<any[]> = new EventEmitter<any[]>(true);
    @Output() public readonly rowClick: EventEmitter<T> = new EventEmitter<T>(true);
    @Output() public readonly rowDoubleClick: EventEmitter<T> = new EventEmitter<T>(true);

    @ViewChild(MatPaginator, {static: true}) public paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) public sort: MatSort;
    @ViewChildren(CoreTableFilterComponent) public filtersElementHolder: QueryList<CoreTableFilterComponent>;
    @ViewChildren(ExpandedDetailDirective) public expandedDetailHosts: QueryList<ExpandedDetailDirective>;

    public readonly filters: FilterMap = {};
    public selection: SelectionModel<any>;
    public selectedRow: T;

    private doubleClick$: ReplaySubject<{row: T, time: Date}> = new ReplaySubject<{row: T, time: Date}>(2);
    private componentDestroyed$: Subject<boolean> = new Subject<boolean>();

    public constructor(@Inject(TRANSLATE_WRAPPER_TOKEN) private readonly translateWrapperService: TranslateWrapper,
                       @Inject(NOTIFICATION_WRAPPER_TOKEN) private readonly notificationService: NotificationWrapper,
                       private readonly coreTableService: CoreTableService, ) {
    }

    public ngOnDestroy(): void {
        this.coreTableService.clearFilters();
        this.componentDestroyed$.next(true);
        this.componentDestroyed$.complete();
    }

    public ngOnInit(): void {
        if (!this.configuration) {
            throw new Error('this.configuration must be defined.');
        }

        const filters$ = this.coreTableService.filters$;

        this.configuration.columns.forEach((column: TableColumn) => {
            if (column.filter && column.filter.predefinedValue && column.filter.predefinedValue.length > 0) {
                this.coreTableService.addFilter(column, column.filter.predefinedValue[0]);
            }
        });

        const constructRequestParameters$ = filters$.pipe(map((filters: Filter[]) => {
            const requestParameters = new TableRequestParameters(this.paginator, this.sort);
            requestParameters.sortActive = this.getSortActive();
            requestParameters.filter = filters;

            return requestParameters;
        }), );

        if (this.sort) {
            this.sort.sortChange
                .pipe(switchMap(() => constructRequestParameters$))
                .subscribe((requestParameters: TableRequestParameters) => {
                    this.emitRequestParameters(TableChangeEvent.Create(TableChangeType.SORT, requestParameters, requestParameters.filter));
                });
        }

        this.paginator.page.pipe(switchMap(() => constructRequestParameters$))
            .subscribe((requestParameters: TableRequestParameters) => {
                this.requestData.emit(TableChangeEvent.Create(TableChangeType.PAGINATE, requestParameters, requestParameters.filter));
            });

        filters$.pipe(switchMap(() => constructRequestParameters$))
                .subscribe((requestParameters: TableRequestParameters) => {
                    this.emitRequestParameters(TableChangeEvent.Create(TableChangeType.FILTER, requestParameters, requestParameters.filter));
                });
    }

    public ngOnChanges(simpleChanges: SimpleChanges): void {
        if (this.selection) {
            this.selection.clear();
        }

        if (simpleChanges.configuration && simpleChanges.configuration.previousValue !== simpleChanges.configuration.currentValue) {
            this.configuration = this.coreTableService.processConfiguration(this.configuration);
            this.setPageSize();
            this.setSorting();
            this.setLabels();

            if (this.selectableTable) {
                this.configuration.columns.unshift(new TableColumn({columnDef: 'nothing'}));
                this.selection = new SelectionModel<any>(this.configuration.selection === 'multi', []);
                this.selection.changed.subscribe((data: SelectionChange<any>) => {
                    // Filter out deleted items from selected items
                    data.source.selected.forEach((selectedItem: any) => {
                        if (!this.data.content || !this.data.content.some((item: any) => item.id === selectedItem.id)) {
                            data.source.deselect(selectedItem);
                        }
                    });
                    this.selectionChange.emit(data.source.selected);
                }, (error) => this.notificationService.openErrorNotification('error.coreTable.changeError'));
            }
        }
    }

    public getLabel(columnConfig: TableColumn): Observable<string> {
        if (columnConfig.label) {
            return of(columnConfig.label);
        }
        return this.translateWrapperService.get(columnConfig.labelKey)
                   .pipe(map((label) => {
                       if (typeof label === 'string' && this.configuration.uppercaseHeader !== false) {
                           return label.toUpperCase();
                       }
                       return label;
                   }));
    }

    public rowClicked(row: T): void {
        this.rowClick.emit(row);
    }

    public rowDoubleClicked(row: T): void {
        this.doubleClick$.next({row, time: new Date()});
        let clickedRow: {row: T, time: Date} = null;

        this.doubleClick$
            .pipe(
                take(2),
                takeUntil(this.componentDestroyed$),
            )
            .subscribe((item: {row: T, time: Date}) => {
                if (!clickedRow || row !== clickedRow.row) {
                    clickedRow = item;
                } else if (item.time.getTime() - clickedRow.time.getTime() < 300) {
                    this.rowDoubleClick.emit(row);
                }
            });
    }

    public onExpandableRowClicked(row: T): void {
        // Rows are not expandable
        if (!this.configuration.expandedRowTemplate) {
            return;
        }

        // Click on an already selected row
        if (this.selectedRow === row) {
            this.selectedRow = undefined;
            return;
        }

        this.selectedRow = row;
    }

    public reset(): TableChangeEvent {
        this.paginator.pageIndex = 0;
        return TableChangeEvent.Init(new TableRequestParameters({
            pageSize: this.paginator.pageSize,
            pageIndex: 0
        }, {
            active: this.getSortActive(),
            direction: this.sort.direction
        }), []);
    }

    public isRightAligned(columnType: string): boolean {
        return [
            TableCellType.NUMBER,
            TableCellType.NUMBERINT,
            TableCellType.NUMBERFLOAT1,
            TableCellType.NUMBERFLOAT2,
            TableCellType.PERCENT,
            TableCellType.TOPERCENT,
        ].includes(columnType as TableCellType);
    }

    public getClass(row: T): string {
        if (MiscUtils.isFunction(this.configuration.trClassesCond)) {
            const elements = this.data ? this.data.totalElements : 0;

            return `${this.configuration.trClasses} ${this.configuration.trClassesCond(row, elements)}`;
        }

        return this.configuration.trClasses;
    }

    public resetFilters(guard: boolean) {
        if (guard) {
            this.filtersElementHolder.forEach((filter) => filter.filtersElement.reset());
        }
    }

    public trackColumnConfigByColumnDef(index: number, item: TableColumn): any {
        return item.columnDef;
    }

    private emitRequestParameters(changeEvent: TableChangeEvent): void {
        if (MiscUtils.isFunction(this.paginator.firstPage)) {
            const hasPrev = this.paginator.hasPreviousPage();
            this.paginator.firstPage();
            if (!hasPrev) {
                this.requestData.emit(changeEvent);
            }
        }
    }

    private setPageSize(): void {
        if (this.configuration.paging) {
            this.paginator.pageSize = this.configuration.pageSize;
        } else if (this.data && this.data.content) {
            this.paginator.pageSize = this.data.content.length;
        } else {
            this.paginator.pageSize = this.configuration.pageSize;
        }
        if (this.configuration.predefinedPageIndex || this.configuration.predefinedPageIndex === 0) {
            this.paginator.pageIndex = this.configuration.predefinedPageIndex;
        }
        if (this.configuration.predefinedPageSize || this.configuration.predefinedPageSize === 0) {
            this.paginator.pageSize = this.configuration.predefinedPageSize;
        }
    }

    private setSorting(): void {
        if (this.configuration.predefinedSortActive) {
            this.sort.active = this.configuration.predefinedSortActive;
        }
        if (this.configuration.predefinedSortDirection) {
            this.sort.direction = this.configuration.predefinedSortDirection as SortDirection;
        }
    }

    private setNoDataKey(): void {
        if (!this.configuration.noDataText) {
            this.configuration.noDataText = this.translateWrapperService.instant(DEFAULT_NO_DATA_KEY);
        }
    }

    private setLabels(): void {
        this.configuration.columns.forEach((column: TableColumn) => {
            if (typeof column.label === 'string' && this.configuration.uppercaseHeader !== false) {
                column.label = column.label.toUpperCase();
            }
        });
    }

    /*
    * Get sort active name for requests, since it can differ from the columnDef which it sorts
    * */
    private getSortActive(): Property {
        return (
            this.sort.active && this.configuration.columns
                .find((column: TableColumn) => [column.columnDef, column.columnRequestName].includes(this.sort.active))
                .columnRequestName
        ) as Property;
    }
}
