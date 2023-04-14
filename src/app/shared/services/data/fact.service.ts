import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { hazelnutConfig } from '@hazelnut/hazelnut-common/config/hazelnut-config';
import { Observable } from 'rxjs';
import { ImportChoiceType } from '../../enums/import-choice-type.enum';
import { TableChangeEvent } from '../../hazelnut/core-table';
import { StringUtils } from '../../hazelnut/hazelnut-common/hazelnut';
import { BrowseResponse, Filter, PostContent, Sort } from '../../hazelnut/hazelnut-common/models';
import { Fact } from '../../interfaces/fact.interface';
import { NotificationService } from '../notification.service';
import { ProjectService } from '../project.service';
import { ProjectUserService } from '../storage/project-user.service';
import { map, catchError, tap } from 'rxjs/operators';

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

    private exportTasks(tableChangeEvent?: TableChangeEvent, additionalFilters?: Filter[], projectId?: number): any {
        let filters = [];
        let sort = [];
        if (tableChangeEvent && tableChangeEvent.sortActive && tableChangeEvent.sortDirection) {
            sort = [
                new Sort(tableChangeEvent.sortActive, tableChangeEvent.sortDirection)
            ];
        }
        filters = filters.concat(additionalFilters);
        filters = this.reorderFiltersToApplyCorectTrafficColor(filters);

        return {filters: filters, sort: sort}

        // return this.report(filters, sort, projectId);
    }

     /**
     *  Report task objects of ALL facts and figures into report file and download from API
     * @param {TableChangeEvent} tableChangeEvent
     * @param {Filter[]} additionalFilters
     * @param {number} projectId
     * @returns {any}
     */
     public exportAllFacts(tableChangeEvent?: TableChangeEvent, additionalFilters?: Filter[], projectId?: number): any {
        const data = this.exportTasks(tableChangeEvent, additionalFilters, projectId)
        let filters = data.filters
        let sort = data.sort
        const report = true
        return this.report(filters, sort, projectId, report);
    }

    /**
     *  Report task objects of facts and figures into report file and download from API
     * @param {TableChangeEvent} tableChangeEvent
     * @param {Filter[]} additionalFilters
     * @param {number} projectId
     * @returns {any}
     */
    public exportFacts(tableChangeEvent?: TableChangeEvent, additionalFilters?: Filter[], projectId?: number): any {
        // for facts the url ends with "export" instead of "report" as with other modules and all facts
        const data = this.exportTasks(tableChangeEvent, additionalFilters, projectId)
        let filters = data.filters
        let sort = data.sort
        const report = false
        return this.report(filters, sort, projectId, report);
    }

    public generateTemplate(projectId?: number): any {
        let filters = [
            new Filter("PROJECT_ID", projectId, "NUMBER"),
            new Filter("VALUE_FIRST", null, "NUMBER", "IS_NULL"),
            new Filter("VALUE_SECOND", null, "NUMBER", "IS_NULL"),
            new Filter("VALUE_THIRD", null, "NUMBER", "IS_NULL")
            ]
        let sort = [new Sort()]
        return this.template(filters, sort, projectId)
    }


    /**
     * Import data from an .xls file
     * @param data: formData
     * @param flag: string
     * @param projectId: number
     */
    public importFacts(data:{data: FormData, flag: string, projectId: number}): Observable<any>{
        if (data.flag !== ImportChoiceType.FILL_BLANK && data.flag !== ImportChoiceType.REWRITE_ALL){
            data.flag = ImportChoiceType.DEFAULT
        }

        let headers = new HttpHeaders();
        headers = headers.set('device-id', this.userService.instant.deviceId);
        headers = headers.set('token', this.userService.instant.authToken);

        // *** IMPORTANT !!!! cannot use the method (this.post() from core-service) !!!!
        // *** when using responseType in params, the method needs to be http.post(), NOT http.post<>()
        return this.http.post(`${hazelnutConfig.URL_API}/${this.urlKey}/${data.flag}/project/${data.projectId}`, 
            data.data, 
            {
                headers,
                responseType: 'blob',
                observe: 'response'
            }
            ).pipe(
            map((response: any): any => response),
            catchError(this.handleError),
        );

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

}
