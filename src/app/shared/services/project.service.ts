import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractService } from '../hazlenut/hazelnut-common/services';
import { NotificationService } from './notification.service';
import { ProjectUserService } from './storage/project-user.service';

@Injectable({
    providedIn: 'root'
})

export class ProjectService<T> extends AbstractService<T> {

    public constructor(http: HttpClient,
                       url: string,
                       notificationService: NotificationService,
                       protected readonly userService: ProjectUserService) {
        super(http, notificationService, url);
    }

    protected getHeader(): HttpHeaders {
        // console.log('CALLING HEADER');
        let headers = new HttpHeaders();
        headers = headers.set('device-id', this.userService.instant.deviceId);
        headers = headers.set('token', this.userService.instant.authToken);
        headers = headers.set('Content-Type', 'application/json');
        return headers;
    }
}
