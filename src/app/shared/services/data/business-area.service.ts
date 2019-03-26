import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TableChangeEvent } from '../../hazlenut/core-table';
import { StringUtils } from '../../hazlenut/hazelnut-common/hazelnut';
import { BrowseResponse, Filter, PostContent, Sort } from '../../hazlenut/hazelnut-common/models';
import { BusinessArea } from '../../interfaces/bussiness-area.interface';
import { NotificationService } from '../notification.service';
import { ProjectUserService } from '../project-user.service';
import { ProjectService } from '../project.service';

@Injectable({
  providedIn: 'root'
})
export class BusinessAreaService extends ProjectService<BusinessArea>{

    public constructor(http: HttpClient,
                       notificationService: NotificationService,
                       userService: ProjectUserService,
    ) {
        super(http, 'codeList', notificationService, userService);
    }

    public browseBusinessAreas(tableChangeEvent: TableChangeEvent): Observable<BrowseResponse<BusinessArea>> {
        let filters = [];
        let sort = [new Sort('NAME', 'ASC')];
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
