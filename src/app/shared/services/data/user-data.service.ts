import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TableChangeEvent } from '../../hazelnut/core-table';
import { BrowseResponse, Filter, PostContent } from '../../hazelnut/hazelnut-common/models';
import { User } from '../../interfaces/user.interface';
import { NotificationService } from '../notification.service';
import { ProjectService } from '../project.service';
import { ProjectUserService } from '../storage/project-user.service';

@Injectable({
    providedIn: 'root'
})

/**
 * Fact service communicating with 'user' API url
 */ export class UserDataService extends ProjectService<any> {

    public constructor(http: HttpClient, notificationService: NotificationService, userService: ProjectUserService) {
        super(http, 'user', notificationService, userService);
    }

    /**
     * Get users object from API
     */
    public getUsers(): Observable<any[]> {
        return this.getDetail('');
    }

    public updateUser(id: number, user: any): Observable<User> {
        return this.update(id, user);
    }

    public createUser(user: any): Observable<User> {
        return this.add(user);
    }

    /**
     * Get users from API based on criteria
     * @param tableChangeEvent
     * @param additionalFilters - filters, which are not included in filters tableChangeEvent from the table
     */
    public browseUsers(tableChangeEvent: TableChangeEvent, additionalFilters: Filter[] = []): Observable<BrowseResponse<User>> {
        const postContent: PostContent = PostContent.createForIihf(tableChangeEvent);
        postContent.addFilters(...additionalFilters);

        return this.browseWithSummary(postContent);
    }

    public getUserDetail(id: number): Observable<User> {
        return this.getDetail(id);
    }

    public getOwnUserDetail(id: number): Observable<User> {
        return this.getDetail(id, null, 'own');
    }

}
