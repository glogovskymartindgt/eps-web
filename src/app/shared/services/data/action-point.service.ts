import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TableChangeEvent } from '../../hazlenut/core-table';
import { StringUtils } from '../../hazlenut/hazelnut-common/hazelnut';
import { BrowseResponse, Filter, PostContent, Sort } from '../../hazlenut/hazelnut-common/models';
import { TaskInterface } from '../../interfaces/task.interface';
import { NotificationService } from '../notification.service';
import { ProjectService } from '../project.service';
import { ProjectUserService } from '../storage/project-user.service';

@Injectable({
  providedIn: 'root'
})
export class ActionPointService extends ProjectService<TaskInterface> {

    public constructor(http: HttpClient,
                       notificationService: NotificationService,
                       userService: ProjectUserService,
    ) {
        super(http, 'actionPoint', notificationService, userService);
    }

    /**
     * Ger task objects from API based on criteria
     * @param tableChangeEvent
     * @param additionalFilters
     */
    public browseActionPoints(tableChangeEvent: TableChangeEvent, additionalFilters: Filter[]): Observable<BrowseResponse<TaskInterface>> {
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
                sort = [new Sort(tableChangeEvent.sortActive,
                    tableChangeEvent.sortDirection)];
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

        return this.browseWithSummary(PostContent.create(limit, offset, filters, sort));
    }

    /**
     * Report task objects into report file and download from API
     * @param tableChangeEvent
     * @param additionalFilters
     */
    public exportActionPoints(tableChangeEvent?: TableChangeEvent, additionalFilters?: Filter[], projectId?: number) {
        let filters = [];
        let sort = [];
        if (tableChangeEvent && tableChangeEvent.sortActive && tableChangeEvent.sortDirection) {
            sort = [new Sort(tableChangeEvent.sortActive,
                tableChangeEvent.sortDirection
            )];
        }
        filters = filters.concat(additionalFilters);

        return this.report(filters, sort, projectId);
    }

    /**
     * Create task object with API call
     * @param taskObject
     */
    public createActionPoint(actionPointObject: any) {
        return this.add(actionPointObject);
    }

    /**
     * Edit task object with API call
     * @param id
     * @param taskObject
     */
    public editActionPoint(id: number, taskObject: any) {
        return this.update(id, taskObject);
    }

    /**
     * Get task object from API
     * @param id
     */
    public getActionPointById(id: number) {
        return this.getDetail(id);
    }

}
