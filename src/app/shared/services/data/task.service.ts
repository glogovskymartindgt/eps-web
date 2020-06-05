import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TableChangeEvent } from '../../hazelnut/core-table';
import { StringUtils } from '../../hazelnut/hazelnut-common/hazelnut';
import { BrowseResponse, Filter, PostContent, Sort } from '../../hazelnut/hazelnut-common/models';
import { TaskInterface } from '../../interfaces/task.interface';
import { NotificationService } from '../notification.service';
import { ProjectService } from '../project.service';
import { ProjectUserService } from '../storage/project-user.service';

@Injectable({
    providedIn: 'root'
})

/**
 * Fact service communicating with 'task' API url
 */ export class TaskService extends ProjectService<TaskInterface> {

    public constructor(http: HttpClient, notificationService: NotificationService, userService: ProjectUserService) {
        super(http, 'task', notificationService, userService);
    }

    /**
     * Ger task objects from API based on criteria
     * @param tableChangeEvent
     * @param additionalFilters
     */
    public browseTasks(tableChangeEvent: TableChangeEvent, additionalFilters: Filter[]): Observable<BrowseResponse<TaskInterface>> {
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
        filters = filters.concat(additionalFilters);

        const allFilters = filters.filter((el: Filter): any => el.property === 'RESPONSIBLE_USER_ID');
        if (allFilters.length > 1) {
            const oneFilter: Filter = allFilters[allFilters.length - 1];
            filters = filters.filter((el: Filter): any => el.property !== 'RESPONSIBLE_USER_ID');
            if (oneFilter.value !== 'All') {
                filters.push(oneFilter);
            }
        }

        // Traffic color must be first to proper filtering
        filters = this.reorderFiltersToApplyCorectTrafficColor(filters);

        return this.browseWithSummary(PostContent.create(limit, offset, filters, sort));
    }

    /**
     * Report task objects into report file and download from API
     * @param {TableChangeEvent} tableChangeEvent
     * @param {Filter[]} additionalFilters
     * @param {number} projectId
     * @returns {Observable<any>}
     */
    public exportTasks(tableChangeEvent?: TableChangeEvent, additionalFilters?: Filter[], projectId?: number): Observable<any> {
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
     * Create task object with API call
     * @param taskObject
     */
    public createTask(taskObject: any): any {
        return this.add(taskObject);
    }

    /**
     * Edit task object with API call
     * @param id
     * @param taskObject
     */
    public editTask(id: number, taskObject: any): any {
        return this.update(id, taskObject);
    }

    /**
     * Delete task object with API call
     * @param id
     */
    public deleteTask(id: number): any {
        return this.deleteById(id);
    }

    /**
     * Get task object from API
     * @param id
     */
    public getTaskById(id: number): any {
        return this.getDetail(id);
    }

    /**
     * Reorder filters with conditiona that traffic light filters are first
     * @param filters
     */
    private reorderFiltersToApplyCorectTrafficColor(filters): any {
        return filters.sort(this.compare);
    }

    /**
     * Traffic light sort function
     * @param comparable
     * @param compared
     * @returns {number}
     */
    private compare(comparable, compared): number {
        if (comparable.property === 'TRAFFIC_LIGHT') {
            return -1;
        }
        if (comparable.property !== 'TRAFFIC_LIGHT') {
            return 1;
        }

        return 0;
    }

}
