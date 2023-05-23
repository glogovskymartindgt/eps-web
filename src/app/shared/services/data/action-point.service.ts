import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { hazelnutConfig } from '@hazelnut/hazelnut-common/config/hazelnut-config';
import { Observable } from 'rxjs';
import { TableChangeEvent } from '../../hazelnut/core-table';
import { StringMap, StringUtils } from '../../hazelnut/hazelnut-common/hazelnut';
import { BrowseResponse, Filter, PostContent, Sort } from '../../hazelnut/hazelnut-common/models';
import { ActionPoint } from '../../models/action-point.model';
import { NotificationService } from '../notification.service';
import { ProjectService } from '../project.service';
import { ProjectUserService } from '../storage/project-user.service';

@Injectable({
    providedIn: 'root'
})
export class ActionPointService extends ProjectService<ActionPoint> {
    public static allowedImages = ['JPG', 'JPEG', 'PNG'];
    public static allowedVideos = ['MP4', 'MPEG'];
    public static allowedDocuments = ['ZIP', 'PDF', 'CSV', 'TXT', 'XLS', 'XLSX', 'DOC', 'DOCX'];

    public static acceptedImageTypes = ['image/jpg', 'image/jpeg', 'image/png'];
    public static acceptedVideoTypes = ['video/mp4', 'video/mpeg'];
    public static acceptedDocumentTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
        'application/rtf',
        'text/plain',
        'text/csv',
        'application/zip',
        'application/x-zip-compressed'
    ];

    public constructor(http: HttpClient, notificationService: NotificationService, userService: ProjectUserService) {
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
        filters = this.reorderFiltersToApplyCorectTrafficColor(filters);

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
     * Delete task object with API call
     * @param id
     */
    public deleteActionPoint(id: number): any {
        return this.deleteById(id);
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
    private reorderFiltersToApplyCorectTrafficColor(filters): any {
        return filters.sort(this.compare);
    }

    /**
     * Compare sort function with traffic light property preselection
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

    /**
     * Get all attachments for an action point
     * @param id
     */
    public getAttachments(id: number) {
        return this.get({
            url: `${hazelnutConfig.URL_API}/actionPointAttachment/actionPoint/${id}`,
            mapFunction: (response: any): any => response,
        });
    }

    /**
     * Add an attachment to a action point
     * @param body
     */
    public addAttachmentToActionPoint(body): Observable<any> {
        if (!body) {
            return;
        }
        let headers = new HttpHeaders();
        headers = headers.set('device-id', this.userService.instant.deviceId);
        headers = headers.set('token', this.userService.instant.authToken);

        return this.post({
            headers,
            url: `${hazelnutConfig.URL_API}/actionPointAttachment`,
            mapFunction: (response: any): any => response,
            body: body,
        });
    }

    /**
     * Delete attachment by ID
     * @param id
     * @param params
     */
    public deleteAttachmentById(id: number, params?: StringMap): Observable<any> {
        return this.delete({
            params,
            url: `${hazelnutConfig.URL_API}/actionPointAttachment/${id}`,
            mapFunction: this.extractDetail
        });
    }

    /**
     * Download all attachments by action point ID
     * @param actionPointId
     */
    public downloadAllAttachments(actionPointId: number): Observable<any> {
        return this.getBlob(
            `${hazelnutConfig.URL_API}/actionPointAttachment/zip/${actionPointId}`,
            (data) => data.body
        )
    }
}
