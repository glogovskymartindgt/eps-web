import { TableChangeEvent } from '../../core-table';
import { hazelnutConfig } from '../config/hazelnut-config';
import { StringUtils } from '../hazelnut';
import { Filter } from './filter.model';
import { Sort } from './sort.model';

export interface PostContentInterface {
    filterCriteria: {
        criteria: Filter[];
    };
    sortingCriteria: {
        criteria: Sort[];
    };
    paging: {
        offset: number; limit: number;
    };
}

export class PostContent implements PostContentInterface {
    public filterCriteria: {
        criteria: Filter[];
    } = {criteria: []};

    public sortingCriteria: {
        criteria: Sort[];
    } = {criteria: []};

    public paging: {
        offset: number; limit: number;
    } = {
        offset: 0,
        limit: hazelnutConfig.BROWSE_LIMIT
    };

    public static create(limit: number, offset: number, filter: Filter[] = [], sort: Sort[] = [new Sort()]): PostContent {
        return new PostContent().setLimit(limit)
                                .setOffset(offset)
                                .addFilters(...filter)
                                .addSorts(...sort);
    }

    public static createForIihf(tableChangeEvent: TableChangeEvent): PostContent {
        let filters = [];
        let sort = [];
        let limit = 15;
        let offset = 0;

        if (tableChangeEvent) {
            limit = tableChangeEvent.pageSize;
            offset = tableChangeEvent.pageIndex * tableChangeEvent.pageSize;
            filters = Object.values(tableChangeEvent.filters);
            filters.forEach((filter: any): any => filter.property = StringUtils.convertCamelToSnakeUpper(filter.property));
            if (tableChangeEvent.sortActive && tableChangeEvent.sortDirection) {
                sort = [
                    new Sort(tableChangeEvent.sortActive, tableChangeEvent.sortDirection)
                ];
            }
        }

        return PostContent.create(limit, offset, filters, sort);
    }

    public static parse(object: any): PostContent {
        const result: PostContent = new PostContent();

        if (object.paging) {
            result.paging = {
                offset: object.paging.offset,
                limit: object.paging.limit,
            };
        } else {
            result.paging = {
                offset: object.offset,
                limit: object.limit,
            };
        }

        result.filterCriteria = object.filterCriteria || object.filter;
        result.sortingCriteria = object.sortingCriteria || object.sort;

        return result;
    }

    public setLimit(limit: number): PostContent {
        this.paging.limit = limit;

        return this;
    }

    public setOffset(offset: number): PostContent {
        this.paging.offset = offset;

        return this;
    }

    public addFilters(...filters: Filter[]): PostContent {
        if (!this.filterCriteria) {
            this.filterCriteria = {
                criteria: [],
            };
        }

        this.filterCriteria.criteria.push(...filters);

        return this;
    }

    public addSorts(...sorts: Sort[]): PostContent {
        if (!this.sortingCriteria) {
            this.sortingCriteria = {
                criteria: [],
            };
        }
        this.sortingCriteria.criteria.push(...sorts);

        return this;
    }

    public hasSort(): boolean {
        return this.sortingCriteria && Array.isArray(this.sortingCriteria.criteria) && this.sortingCriteria.criteria.length > 0;
    }

    public prepareAndGet(browseLimit: number): PostContent {
        if (!this.hasSort()) {
            this.addSorts(new Sort());
        }

        if (isNaN(this.paging.limit) && isNaN(this.paging.offset)) {
            delete this.paging;
        } else {
            if (!this.paging.offset) {
                this.paging.offset = 0;
            }

            if (!this.paging.limit) {
                this.paging.limit = browseLimit;
            }
        }

        return this;
    }
}
