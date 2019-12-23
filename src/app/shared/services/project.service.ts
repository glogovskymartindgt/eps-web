import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { hazelnutConfig } from '../hazelnut/hazelnut-common/config/hazelnut-config';
import { AbstractService } from '../hazelnut/hazelnut-common/services';
import { NotificationService } from './notification.service';
import { ProjectUserService } from './storage/project-user.service';

/**
 * HTTP methods only for this project should be in project service
 */
export class ProjectService<T> extends AbstractService<T> {

    public constructor(http: HttpClient,
                       url: string,
                       notificationService: NotificationService,
                       protected readonly userService: ProjectUserService) {
        super(http, notificationService, url);
    }

    /**
     * Function returns list of result from browse API
     * @param id - id of searched object
     * @param projectId - projectId of searched object
     */
    public getFactItemDetail(id: number | string, projectId: number | string): Observable<T> {
        const realIds = id && projectId ? `/${id}/${projectId}` : '';

        return this.get({
            url: `${hazelnutConfig.URL_API}/${this.urlKey}${realIds}`,
            mapFunction: this.extractDetail
        });
    }

    protected getHeader(): HttpHeaders {
        let headers = new HttpHeaders();
        headers = headers.set('device-id', this.userService.instant.deviceId);
        headers = headers.set('token', localStorage.getItem(this.userService.login) ? JSON.parse(localStorage.getItem(this.userService.login)).authToken : '');
        headers = headers.set('Content-Type', 'application/json');

        return headers;
    }

}
