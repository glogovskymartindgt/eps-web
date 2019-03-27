import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TableChangeEvent } from '../../hazlenut/core-table';
import { StringUtils } from '../../hazlenut/hazelnut-common/hazelnut';
import { BrowseResponse, PostContent, Sort } from '../../hazlenut/hazelnut-common/models';
import { TaskInterface } from '../../interfaces/task.interface';
import { NotificationService } from '../notification.service';
import { ProjectService } from '../project.service';
import { ProjectUserService } from '../storage/project-user.service';

@Injectable({
  providedIn: 'root'
})

export class TaskService extends ProjectService<TaskInterface>{

    public constructor(http: HttpClient,
                       notificationService: NotificationService,
                       userService: ProjectUserService,
    ) {
        super(http, 'task', notificationService, userService);
    }

    public browseTasks(tableChangeEvent: TableChangeEvent): Observable<BrowseResponse<TaskInterface>> {
        let filters = [];
        let sort = [];
        let limit = 10;
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
