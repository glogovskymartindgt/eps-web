import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { StringUtils } from '../hazelnut-common/hazelnut/';
import { Filter, Property } from '../hazelnut-common/models';
import { CoreTableConfigInterface, GLOBAL_CONFIG_TOKEN } from './core-table-config.interface';
import { TableColumn } from './models/table-column.model';
import { TableConfiguration } from './models/table-configuration.model';
import { TableFilterType } from './models/table-filter-type.enum';

const DEFAULT_DEBOUNCE_TIME = 500;

const DEFAULT_PAGE_SIZE_OPTIONS = [5, 10, 25, 100];

const DEFAULT_PAGE_SIZE = 10;

const DEFAULT_NO_DATA_KEY = 'No data';

@Injectable()
export class CoreTableService {
    private readonly filtersSubject$: Subject<Filter[]> = new BehaviorSubject<Filter[]>([]);
    public filters$: Observable<Filter[]> = this.filtersSubject$.asObservable();
    private readonly filters: Filter[] = [];

    public constructor(
        @Inject(GLOBAL_CONFIG_TOKEN) private readonly globalTableConfig: CoreTableConfigInterface,
    ) {
    }

    private _configuration: TableConfiguration;

    public get configuration(): TableConfiguration {
        return this._configuration;
    }

    public clearFilters(): void {
        this.filters.splice(0, this.filters.length);
    }

    public addFilter(column: TableColumn, value: any): void {
        const propertyName = column.columnDef as Property;
        this.deleteExistingChangedFilters(StringUtils.convertCamelToSnakeUpper(propertyName));

        if (!value) {
            this.filtersSubject$.next(this.filters);
            return;
        }
        switch (column.filter.type) {
            case TableFilterType.SELECT: {
                this.filters.push(new Filter(propertyName, value, 'ENUM', 'EQ'));
                break;
            }
            case TableFilterType.TYPE: {
                this.filters.push(new Filter(propertyName, value, 'TYPE', 'EQ'));
                break;
            }
            case TableFilterType.SELECT_STRING: {
                this.filters.push(new Filter(propertyName, value, 'STRING', 'EQ'));
                break;
            }
            case TableFilterType.SELECT_NUMBER: {
                this.filters.push(new Filter(propertyName, value, 'NUMBER', 'EQ'));
                break;
            }
            case TableFilterType.SELECT_ANY_DATE_TIME: {
                this.filters.push(new Filter(propertyName, null, 'DATE_TIME', value));
                break;
            }
            case TableFilterType.STRING: {
                this.filters.push(new Filter(propertyName, value, column.filter.valueType, 'LIKE_IGNORE_CASE'));
                break;
            }
            case TableFilterType.NUMBER: {
                if (value.from) {
                    this.filters.push(new Filter(propertyName, value.from, 'NUMBER', 'GOE'));
                }
                if (value.to) {
                    this.filters.push(new Filter(propertyName, value.to, 'NUMBER', 'LOE'));
                }
                break;
            }
            case TableFilterType.DATERANGE: {
                if (value.dateFrom) {
                    this.filters.push(new Filter(propertyName, value.dateFrom, 'DATE', 'GOE'));
                }
                if (value.dateTo) {
                    this.filters.push(new Filter(propertyName, value.dateTo, 'DATE', 'LOE'));
                }
                break;
            }
            case TableFilterType.DATETIME_AS_DATERANGE: {
                this.createFiltersFromDatetimeRange(value, propertyName);
                break;
            }
            case TableFilterType.TRAFFIC_LIGHT: {
                if (value.length > 0) {
                    const colorArray = value.toString().split(',');
                    colorArray.forEach((color) => {
                        this.filters.push(
                            new Filter(propertyName,
                                color.toString().toLocaleUpperCase(),
                                'ENUM',
                                'EQ',
                                'OR'));

                    });
                }
                break;
            }
        }
        this.filtersSubject$.next(this.filters);
    }

    public processConfiguration(localConfig: TableConfiguration): TableConfiguration {
        this._configuration = {...localConfig};

        // paging config
        this.setPagingByProcessingConfiguration();

        // uppercase header
        if (this._configuration.uppercaseHeader === undefined) {
            this._configuration.uppercaseHeader = this.globalTableConfig.uppercaseHeader !== undefined
                ? this.globalTableConfig.uppercaseHeader : true;
        }

        // table row classes
        if (!this._configuration.trClasses) {
            this._configuration.trClasses = this.globalTableConfig.trClasses || '';
        }

        // column borders displayed
        if (this._configuration.columnBorders === undefined) {
            this._configuration.columnBorders = this.globalTableConfig.columnBorders || false;
        }

        // filter delay debounce
        if (!this._configuration.filterDebounceTime) {
            this._configuration.filterDebounceTime = this.globalTableConfig.filterDebounceTime || DEFAULT_DEBOUNCE_TIME;
        }

        // text displayed when no data
        if (!this._configuration.noDataText) {
            this._configuration.noDataText = this.globalTableConfig.noDataText || '';
        }

        return this._configuration;
    }

    private deleteExistingChangedFilters(propertyName: string): void {
        const filters = this.filters.filter((item: Filter) => item.property === propertyName);
        filters.forEach((filter: Filter) => {
            this.filters.splice(this.filters.indexOf(filter), 1);
        });
    }

    private createFiltersFromDatetimeRange(value: any, propertyName: Property) {
        value.dateFrom = value.dateFrom !== null ? new Date(value.dateFrom).toISOString() : value.dateFrom;
        if (value.dateFrom) {
            this.filters.push(new Filter(propertyName, value.dateFrom, 'DATE_TIME', 'GOE'));
        }
        if (value.dateTo) {
            this.filters.push(new Filter(propertyName, value.dateTo, 'DATE_TIME', 'LOE'));
        }
    }

    private setPagingByProcessingConfiguration() {
        if (!this._configuration.pageSizeOptions) {
            this._configuration.pageSizeOptions = this.globalTableConfig.pageSizeOptions || DEFAULT_PAGE_SIZE_OPTIONS;
        }
        if (this._configuration.paging === undefined) {
            this._configuration.paging = this.globalTableConfig.paging !== undefined ? this.globalTableConfig.paging : true;
        }
        if (!this._configuration.pageSize) {
            this._configuration.pageSize = this.globalTableConfig.pageSize || DEFAULT_PAGE_SIZE;
        }
    }
}
