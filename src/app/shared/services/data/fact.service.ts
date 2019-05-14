import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TableChangeEvent } from '../../hazlenut/core-table';
import { StringUtils } from '../../hazlenut/hazelnut-common/hazelnut';
import { BrowseResponse, PostContent, Sort, Filter } from '../../hazlenut/hazelnut-common/models';
import { Fact } from '../../interfaces/fact.interface';
import { NotificationService } from '../notification.service';
import { ProjectService } from '../project.service';
import { ProjectUserService } from '../storage/project-user.service';

@Injectable({
    providedIn: 'root'
})
export class FactService extends ProjectService<Fact> {

    public constructor(http: HttpClient,
                       notificationService: NotificationService,
                       userService: ProjectUserService,
    ) {
        super(http, 'factItem', notificationService, userService);
    }

    public browseFacts(tableChangeEvent: TableChangeEvent, projectFilter?: Filter): Observable<BrowseResponse<Fact>> {
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
        if (projectFilter) {
            filters.push(projectFilter);
        }       
        return this.browseWithSummary(PostContent.create(limit, offset, filters, sort));
    }

    public createFact(factObject: any) {
        return this.add(factObject);
    }

    public getFactById(id: number, projectId: number) {
        return this.getVenueDetail(id, projectId);
    }

    public editTask(id: number, taskObject: any) {
        return this.update(id, taskObject);
    }

}
