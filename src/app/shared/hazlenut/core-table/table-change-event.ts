import { StringUtils } from '../hazelnut-common/hazelnut';
import { Direction, Filter, Property } from '../hazelnut-common/models';
import { TableRequestParameters } from './models/table-request-parameters.model';

export enum TableChangeType {
    FILTER = 'FILTER',
    SORT = 'SORT',
    PAGINATE = 'PAGINATE',
    INIT = 'INIT',
}

export interface FilterMap {
    [key: string]: Filter;
}

export class TableChangeEvent {
    public readonly pageSize: number;
    public  pageIndex: number;
    public readonly filters: Filter[] = [];
    public readonly sortActive: Property;
    public readonly sortDirection: Direction | '';

    private constructor(public readonly type: TableChangeType, params: TableRequestParameters, filters: Filter[]) {
        this.pageIndex = params.pageIndex;
        this.pageSize = params.pageSize;

        if (params.sortActive) {
            this.sortDirection = StringUtils.convertCamelToSnakeUpper(params.sortDirection) as Direction | '';
            this.sortActive = StringUtils.convertCamelToSnakeUpper(params.sortActive) as Property;
        }
        this.filters = filters;
    }

    public static Init(params: TableRequestParameters, filters: Filter[]): TableChangeEvent {
        return new TableChangeEvent(TableChangeType.INIT, params, filters);
    }

    public static Sort(params: TableRequestParameters, filters: Filter[]): TableChangeEvent {
        return new TableChangeEvent(TableChangeType.SORT, params, filters);
    }

    public static Filter(params: TableRequestParameters, filters: Filter[]): TableChangeEvent {
        return new TableChangeEvent(TableChangeType.FILTER, params, filters);
    }

    public static Paginate(params: TableRequestParameters, filters: Filter[]): TableChangeEvent {
        return new TableChangeEvent(TableChangeType.PAGINATE, params, filters);
    }

    public static Create(type: TableChangeType, params: TableRequestParameters, filters: Filter[]): TableChangeEvent {
        return new TableChangeEvent(TableChangeType.PAGINATE, params, filters);
    }

}
