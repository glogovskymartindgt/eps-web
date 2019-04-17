import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { TableChangeEvent } from '../../hazlenut/core-table';
import { StringUtils } from '../../hazlenut/hazelnut-common/hazelnut';
import { BrowseResponse, Filter, PostContent, Sort } from '../../hazlenut/hazelnut-common/models';
import { BusinessArea } from '../../interfaces/bussiness-area.interface';
import { Category } from '../../interfaces/category.interface';
import { SourceOfAgenda } from '../../interfaces/source-of-agenda.interface';
import { SubCategory } from '../../interfaces/subcategory.interface';
import { NotificationService } from '../notification.service';
import { ProjectService } from '../project.service';
import { ProjectEventService } from '../storage/project-event.service';
import { ProjectUserService } from '../storage/project-user.service';

@Injectable({
    providedIn: 'root'
})
export class BusinessAreaService extends ProjectService<BusinessArea> {

    public constructor(http: HttpClient,
                       notificationService: NotificationService,
                       userService: ProjectUserService,
                       private readonly projectEventService: ProjectEventService
    ) {
        super(http, 'codeList', notificationService, userService);
    }

    public browseBusinessAreas(tableChangeEvent: TableChangeEvent): Observable<BrowseResponse<BusinessArea>> {
        let filters = [];
        let sort = [];
        let limit = 15;
        let offset = 0;

        if (tableChangeEvent) {
            limit = tableChangeEvent.pageSize;
            offset = tableChangeEvent.pageIndex * tableChangeEvent.pageSize;
            filters = Object.values(tableChangeEvent.filters);
            filters.forEach((filter) =>
                filter.property = StringUtils.convertCamelToSnakeUpper(filter.property)
            );
            if (tableChangeEvent.sortActive && tableChangeEvent.sortDirection) {
                sort = [new Sort(tableChangeEvent.sortActive,
                    tableChangeEvent.sortDirection)];
            }
            filters.push(new Filter('CODE', 'BAREA'));
        }
        return this.browseWithSummary(PostContent.create(limit, offset, filters, sort));
    }

    public listBusinessAreas(): Observable<BrowseResponse<BusinessArea>> {
        return this.browseWithSummary(PostContent.create(100, 0, [], []));
    }

    public listSourceOfAgendas(): Observable<BrowseResponse<SourceOfAgenda>> {
      return this.getListByCode('ASO');
    }

    public listCategories(): Observable<BrowseResponse<Category>> {
        return this.getListByCode('CAT');
    }

    public listSubCategories(categoryId: number): Observable<SubCategory[]> {
        return this.http.get<SubCategory[]>(
            `${environment.URL_API}/codeList/${this.projectEventService.instant.id}/${categoryId}`,
            {headers: this.getHeader()}
        );
    }

    private getListByCode(code: string): Observable<BrowseResponse<any>>{
        return this.browseWithSummary(
            PostContent.create(100, 0, [new Filter('CODE', code)], [])
        );
    }
}
