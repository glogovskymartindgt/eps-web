import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AbstractService } from '../hazlenut/hazelnut-common/services';
import { NotificationService } from './notification.service';
import { ProjectUserService } from './storage/project-user.service';

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
}
