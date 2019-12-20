import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TableChangeEvent } from '../../hazlenut/core-table';
import { StringUtils } from '../../hazlenut/hazelnut-common/hazelnut';
import { BrowseResponse, Filter, PostContent, Sort } from '../../hazlenut/hazelnut-common/models';
import { ActionPoint } from '../../models/action-point.model';
import { NotificationService } from '../notification.service';
import { ProjectService } from '../project.service';
import { ProjectUserService } from '../storage/project-user.service';

@Injectable({
    providedIn: 'root'
})
export class ActionPointService extends ProjectService<ActionPoint> {

    public constructor(http: HttpClient, notificationService: NotificationService, userService: ProjectUserService,) {
        super(http, 'actionPoint', notificationService, userService);
    }

    /**
     * Ger task objects from API based on criteria
     * @param tableChangeEvent
     * @param additionalFilters
     */
    public browseActionPoints(tableChangeEvent: TableChangeEvent, additionalFilters: Filter[]): Observable<BrowseResponse<ActionPoint>> {
        let filters = [];
        let sort = [];
        let limit = 15;
        let offset = 0;

        if (tableChangeEvent) {
            limit = tableChangeEvent.pageSize;
            offset = tableChangeEvent.pageIndex * tableChangeEvent.pageSize;
            filters = Object.values(tableChangeEvent.filters);
            filters.forEach((filter) => filter.property = StringUtils.convertCamelToSnakeUpper(filter.property));
            if (tableChangeEvent.sortActive && tableChangeEvent.sortDirection) {
                sort = [
                    new Sort(tableChangeEvent.sortActive, tableChangeEvent.sortDirection)
                ];
            }
        }
        filters = filters.concat(additionalFilters);

        const allFilters = filters.filter((el: Filter) => el.property === 'RESPONSIBLE_USER_ID');
        if (allFilters.length > 1) {
            const oneFilter: Filter = allFilters[allFilters.length - 1];
            filters = filters.filter((el: Filter) => el.property !== 'RESPONSIBLE_USER_ID');
            if (oneFilter.value !== 'All') {
                filters.push(oneFilter);
            }
        }

        // Traffic color must be first to proper filtering
        filters = this.reorderFiltersToApplyCorectTrafficColor(filters);
        return this.browseWithSummary(PostContent.create(limit, offset, filters, sort));
    }

    /**
     *
     * @param {TableChangeEvent} tableChangeEvent
     * @param {Filter[]} additionalFilters
     * @param {number} projectId
     * @returns {Observable<any>}
     */
    public exportActionPoints(tableChangeEvent?: TableChangeEvent, additionalFilters?: Filter[], projectId?: number): any {
        let filters = [];
        let sort = [];
        if (tableChangeEvent && tableChangeEvent.sortActive && tableChangeEvent.sortDirection) {
            sort = [
                new Sort(tableChangeEvent.sortActive, tableChangeEvent.sortDirection)
            ];
        }
        filters = filters.concat(additionalFilters);

        return this.report(filters, sort, projectId);
    }

    /**
     * Create task object with API call
     */
    public createActionPoint(actionPointObject: any): any {
        return this.add(actionPointObject);
    }

    /**
     * Edit task object with API call
     * @param id
     * @param taskObject
     */
    public editActionPoint(id: number, taskObject: any): any {
        return this.update(id, taskObject);
    }

    /**
     * Get task object from API
     * @param id
     */
    public getActionPointById(id: number): any {
        return this.getDetail(id);
    }

    /**
     * Reorder filters with conditiona that traffic light filters are first
     * @param filters
     */
    private reorderFiltersToApplyCorectTrafficColor(filters) {
        return filters.sort(this.compare);
    }

    /**
     * Compare sort function with traffic light property preselection
     * @param a
     * @param b
     */
    private compare(a, b) {
        if (a.property === 'TRAFFIC_LIGHT') {
            return -1;
        }
        if (a.property !== 'TRAFFIC_LIGHT') {
            return 1;
        }
        return 0;
    }

}
