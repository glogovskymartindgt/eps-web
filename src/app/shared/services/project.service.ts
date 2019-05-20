import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AbstractService } from '../hazlenut/hazelnut-common/services';
import { NotificationService } from './notification.service';
import { ProjectUserService } from './storage/project-user.service';
import { Observable } from 'rxjs';
import { HazelnutConfig } from '../hazlenut/hazelnut-common/config/hazelnut-config';

/**
 * HTTP methods only for this project should be here
 */
export class ProjectService<T> extends AbstractService<T> {

    public constructor(http: HttpClient,
                       url: string,
                       notificationService: NotificationService,
                       protected readonly userService: ProjectUserService) {
        super(http, notificationService, url);
    }

    protected getHeader(): HttpHeaders {
        let headers = new HttpHeaders();
        headers = headers.set('device-id', this.userService.instant.deviceId);
        headers = headers.set('token', localStorage.userData ? JSON.parse(localStorage.userData).authToken : '');
        headers = headers.set('Content-Type', 'application/json');
        return headers;
    }

    /**
     * * Function returns list of result from browse API
     *
     * @param id - id of searched object
     * @param projectId - projectId of searched object
     * @param params 
     */
    public getFactItemDetail(id: number | string, projectId: number | string): Observable<T> {
        const realIds = id && projectId ? `/${id}/${projectId}` : '';
        return this.get({
            url: `${HazelnutConfig.URL_API}/${this.urlKey}${realIds}`,
            mapFunction: this.extractDetail
        });
    }

}
