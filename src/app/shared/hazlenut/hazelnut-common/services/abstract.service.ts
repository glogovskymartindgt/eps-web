import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ReportType } from '../../../enums/report-type.enum';
// TODO: abstract service shouldn't be dependent od core-table
import { TableChangeEvent } from '../../core-table/table-change-event';
import { NOTIFICATION_WRAPPER_TOKEN, NotificationWrapper } from '../../small-components/notifications/notification.wrapper';
import { hazelnutConfig } from '../config/hazelnut-config';
import { StringMap } from '../hazelnut';
import { BrowseResponse, Direction, Filter, PostContent, Sort } from '../models';
import { CountModel } from '../models/count.model';
import { AbstractServiceParams, CoreService } from './core-service.service';

/**
 * HTTP methods which find usage in multiple projects are here
 */
export abstract class AbstractService<T = any> extends CoreService<T> {
    protected constructor(http: HttpClient, @Inject(NOTIFICATION_WRAPPER_TOKEN) notificationService: NotificationWrapper, protected readonly urlKey: string) {
        super(http, notificationService);
    }

    /**
     * Function return results from browse api for {@link CoreTableComponent}
     */
    public browseTable(params: TableChangeEvent, url = this.urlKey + '/browse'): Observable<BrowseResponse<T>> {
        const filters: Filter[] = Object.keys(params.filters)
                                        .map((key: string) => params.filters[key]);
        const sorts: Sort[] = [];

        if (params.sortActive) {
            sorts.push(new Sort(params.sortActive, params.sortDirection as Direction));
        }

        return this.browseInner(`${hazelnutConfig.URL_API}/${url}`,
            PostContent.create(params.pageSize, params.pageSize * params.pageIndex, filters, sorts),
            (response: any) => new BrowseResponse(this.extractListData(response), response.totalElements)
        );
    }

    /**
     * Function returns list of results from browse API
     *
     */
    public getBrowseList(): Observable<T[]> {
        return of([]);
    }

    /**
     * Function returns list of results from filter API
     *
     */
    public getFilterList(): Observable<T[]> {
        return of([]);
    }

    /**
     * * Function returns list of result from browse API
     *
     * @param id - id of searched object
     * @param params
     * @param params
     */
    public getDetail(id: number | string, params?: StringMap): Observable<T> {
        const realId = id ? `/${id}` : '';

        return this.get({
            params,
            url: `${hazelnutConfig.URL_API}/${this.urlKey}${realId}`,
            mapFunction: this.extractDetail
        });
    }

    /**
     * Function create new object
     *
     * @param body - instance of object for create
     */
    public add(body: T, additionalUrl = ''): Observable<T> {
        return this.post({
            body,
            url: `${hazelnutConfig.URL_API}/${this.urlKey}${additionalUrl}`,
            mapFunction: this.extractDetail,
        });
    }

    /**
     * Function update existing object
     *
     * @param id - if of object for update
     * @param body
     */
    public update(id: number, body: T): Observable<T> {
        return this.put({
            body,
            url: `${hazelnutConfig.URL_API}/${this.urlKey}/${id}`,
            mapFunction: this.extractDetail
        });
    }

    public deleteById(id: number, params?: StringMap): Observable<any> {
        const realId = id ? `/${id}` : '';

        return this.delete({
            params,
            url: `${hazelnutConfig.URL_API}/${this.urlKey}${realId}`,
            mapFunction: this.extractDetail
        });
    }

    protected uploadFile<S = T>(url: string, file: File, fileName: string, mapFunction: AbstractServiceParams<S>['mapFunction']): Observable<S> {
        const fd = new FormData();
        fd.append(fileName, file, file ? file.name : undefined);

        return this.post({
            url,
            mapFunction,
            body: fd,
        });
    }

    /**
     *
     */
    protected browse<S = T>(filter: Filter[] = [], sort: Sort[] = [new Sort()], limit: number = hazelnutConfig.BROWSE_LIMIT, offset = 0): Observable<T[]> {
        if (sort.length === 0) {
            sort.push(new Sort());
        }

        return this.browseInner(`${hazelnutConfig.URL_API}/${this.urlKey}/browse`, PostContent.create(limit, offset, filter, sort), this.extractListData);
    }

    protected browseWithSummary<S = T>(postContent: PostContent, additionalUrl = ''): Observable<BrowseResponse<S>> {
        if (!postContent.hasSort()) {
            postContent.addSorts(new Sort());
        }

        if (additionalUrl.endsWith('/')) {
            additionalUrl = additionalUrl.substr(0, additionalUrl.length - 1);
        }

        if (additionalUrl.startsWith('/')) {
            if (this.urlKey.endsWith('/')) {
                additionalUrl = additionalUrl.substr(1, additionalUrl.length);
            }
        } else if (!this.urlKey.endsWith('/')) {
            additionalUrl = '/' + additionalUrl;
        }

        return this.browseInner<BrowseResponse<S>>(`${hazelnutConfig.URL_API}/${this.urlKey}${additionalUrl}browse`, postContent, this.extractDetail);
    }

    /**
     *
     */
    protected count<S = T>(infix: string, filter: Filter[] = []): Observable<CountModel> {
        const content = {
            filterCriteria: {
                criteria: filter,
            },
        };

        return this.post({
            url: `${hazelnutConfig.URL_API}/${this.urlKey}${infix}/count`,
            body: content,
            mapFunction: this.extractDetail
        });
    }

    /**
     *
     */
    protected filter<S = T>(filter: Filter[] = [], sort: Sort[] = [new Sort()]): Observable<{} | S[]> {
        if (sort.length === 0) {
            sort.push(new Sort());
        }

        const body = {
            filterCriteria: {
                criteria: filter,
            },
            sortingCriteria: {
                criteria: sort,
            },
        };

        return this.post<S[]>({
            body,
            url: `${hazelnutConfig.URL_API}/${this.urlKey}/filter`,
            mapFunction: this.extractListData,
        });
    }

    /**
     * Function extract all data from response
     *
     */
    protected extractListData<S = T>(res: {content: S[]}): S[] {
        return (res && res.content) || [];
    }

    /**
     * Function parse and extract response
     *
     */
    protected extractDetail<S = T>(res: S): S {
        return res;
    }

    /**
     *
     */
    protected browseInner<S = T[]>(url: string, content: PostContent, mapFunction: (response: any) => S): Observable<S> {
        return this.post({
            url,
            mapFunction,
            body: content.prepareAndGet(hazelnutConfig.BROWSE_LIMIT)
        });
    }

    /**
     *
     * @param {Filter[]} filter
     * @param {Sort[]} sort
     * @returns {Observable<T>}
     */
    protected report<S = T>(filter: Filter[] = [], sort: Sort[] = [new Sort()], projectId: number): Observable<any> {
        if (sort && sort.length === 0) {
            sort.push(new Sort());
        }
        const content = {
            filterCriteria: {criteria: filter},
            sortingCriteria: {criteria: sort}
        };

        return this.postBlob(`${hazelnutConfig.URL_API}/${this.urlKey}/project/${projectId}/report`, content, this.extractDetail);
    }

    /**
     * @param {string} url
     * @param body
     * @param {(res: Response) => any[]} mapFunction
     * @param params
     * @returns {Observable<S>}
     */
    protected postBlob<S = T[]>(url: string, body: any, mapFunction: (response: any) => S, params: HttpParams | {[param: string]: string | string[]; } = {}): Observable<S> {
        return this.http.post(url, body, {
                       params,
                       headers: this.getHeader(),
                       responseType: 'blob',
                       observe: 'response'
                   })
                   .pipe(map(mapFunction), catchError(this.handleError),);
    }

    /**
     *
     * @param {Filter[]} filter
     * @param {Sort[]} sort
     * @returns {Observable<T>}
     */
    protected reportGet<S = T>(projectId: number, reportId: number): Observable<any> {
        return this.getBlob(`${hazelnutConfig.URL_API}/report/${reportId === 1 ? ReportType.ToDoList : ReportType.RedFlagList}/project/${projectId}`, this.extractDetail);
    }

    /**
     * @param {string} url
     * @param body
     * @param {(res: Response) => any[]} mapFunction
     * @param params
     * @returns {Observable<S>}
     */
    protected getBlob<S = T[]>(url: string, mapFunction: (response: any) => S, params: HttpParams | {[param: string]: string | string[]; } = {}): Observable<S> {
        return this.http.get(url, {
                       params,
                       headers: this.getHeader(),
                       responseType: 'blob',
                       observe: 'response'
                   })
                   .pipe(map(mapFunction), catchError(this.handleError),);
    }

}
