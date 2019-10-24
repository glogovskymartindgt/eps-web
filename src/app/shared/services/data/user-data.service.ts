import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TableChangeEvent } from '../../hazlenut/core-table';
import { StringUtils } from '../../hazlenut/hazelnut-common/hazelnut';
import { BrowseResponse, PostContent, Sort } from '../../hazlenut/hazelnut-common/models';
import { User } from '../../interfaces/user.interface';
import { NotificationService } from '../notification.service';
import { ProjectService } from '../project.service';
import { ProjectUserService } from '../storage/project-user.service';

@Injectable({
  providedIn: 'root'
})

/**
 * Fact service communicating with 'user' API url
 */
export class UserDataService extends ProjectService<User[]> {

    public constructor(http: HttpClient,
                       notificationService: NotificationService,
                       userService: ProjectUserService,
    ) {
        super(http, 'user', notificationService, userService);
    }

    /**
     * Get users object from API
     */
    public getUsers(): Observable<User[]> {
        return this.getDetail('');
    }

    /**
     * Get users from API based on criteria
     * @param tableChangeEvent
     */
    public browseUsers(tableChangeEvent: TableChangeEvent): Observable<BrowseResponse<User>> {
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
        return this.browseWithSummary(PostContent.create(limit, offset, filters, sort));
    }
}
