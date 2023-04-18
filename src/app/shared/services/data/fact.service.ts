import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TableChangeEvent } from '../../hazelnut/core-table';
import { StringUtils } from '../../hazelnut/hazelnut-common/hazelnut';
import { BrowseResponse, Filter, PostContent, Sort } from '../../hazelnut/hazelnut-common/models';
import { Fact } from '../../interfaces/fact.interface';
import { NotificationService } from '../notification.service';
import { ProjectService } from '../project.service';
import { ProjectUserService } from '../storage/project-user.service';

@Injectable({
    providedIn: 'root'
})

/**
 * Fact service communicating with 'factItem' API url
 */ export class FactService extends ProjectService<Fact> {

    public constructor(http: HttpClient, notificationService: NotificationService, userService: ProjectUserService) {
        super(http, 'factItem', notificationService, userService);
    }

    /**
     * Get list of Facts and Figures objects bast on table change event criteria and project filter
     * @param tableChangeEvent
     * @param projectFilter
     */
    public browseFacts(tableChangeEvent: TableChangeEvent, projectFilter?: Filter): Observable<BrowseResponse<Fact>> {
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
        if (projectFilter) {
            filters.push(projectFilter);
        }

        return this.browseWithSummary(PostContent.create(limit, offset, filters, sort));
    }

    /**
     * Create fact object with API call
     * @param factObject
     */
    public createFact(factObject: any): any {
        return this.add(factObject);
    }

    /**
     * Get fact object from API
     * @param id
     * @param projectId
     */
    public getFactById(id: number, projectId: number): any {
        return this.getFactItemDetail(id, projectId);
    }

    /**
     * Edit task object API call
     * @param id
     * @param taskObject
     */
    public editTask(id: number, taskObject: any): any {
        return this.update(id, taskObject);
    }

    /**
     *  Report task objects into report file and download from API
     * @param {TableChangeEvent} tableChangeEvent
     * @param {Filter[]} additionalFilters
     * @param {number} projectId
     * @returns {any}
     */
    public exportTasks(tableChangeEvent?: TableChangeEvent, additionalFilters?: Filter[], projectId?: number): any {
        let filters = [];
        let sort = [];
        if (tableChangeEvent && tableChangeEvent.sortActive && tableChangeEvent.sortDirection) {
            sort = [
                new Sort(tableChangeEvent.sortActive, tableChangeEvent.sortDirection)
            ];
        }
        filters = filters.concat(additionalFilters);
        filters = this.reorderFiltersToApplyCorectTrafficColor(filters);

        return this.report(filters, sort, projectId);
    }

    /**
     * Reorder filters with conditiona that traffic light filters are first
     * @param filters
     */
    private reorderFiltersToApplyCorectTrafficColor(filters): any {
        return filters.sort(this.compare);
    }

    /**
     * Compare sort function with traffic light property preselection
     * @param firstValue
     * @param secondValue
     */
    private compare(firstValue, secondValue): number {
        if (firstValue.property === 'TRAFFIC_LIGHT') {
            return -1;
        }
        if (firstValue.property !== 'TRAFFIC_LIGHT') {
            return 1;
        }

        return 0;
    }

    /**
     * Check whether chosen fact item (unit) is of type "yes/no" or not
     * @param factUnit
     */
    public isYesNoFactItemType(factUnit: string): boolean {
        return ['y/n', 'yes/no'].includes(factUnit.toLowerCase())
    }

}
