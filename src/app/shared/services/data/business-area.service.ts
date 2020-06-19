import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { TableChangeEvent } from '../../hazelnut/core-table';
import { StringUtils } from '../../hazelnut/hazelnut-common/hazelnut';
import { BrowseResponse, Filter, PostContent, Sort } from '../../hazelnut/hazelnut-common/models';
import { BusinessArea } from '../../interfaces/bussiness-area.interface';
import { Category } from '../../interfaces/category.interface';
import { SourceOfAgenda } from '../../interfaces/source-of-agenda.interface';
import { SubCategory } from '../../interfaces/subcategory.interface';
import { CodelistItem } from '../../models/codelist-item.model';
import { Country } from '../../models/country.model';
import { NotificationService } from '../notification.service';
import { ProjectService } from '../project.service';
import { ProjectEventService } from '../storage/project-event.service';
import { ProjectUserService } from '../storage/project-user.service';

@Injectable({
    providedIn: 'root'
})

/**
 * Service communicating with 'codeList' API url
 */ export class BusinessAreaService extends ProjectService<BusinessArea> {

    public constructor(http: HttpClient, notificationService: NotificationService, userService: ProjectUserService, private readonly projectEventService: ProjectEventService) {
        super(http, 'codeList', notificationService, userService);
    }

    /**
     * Get list of business area based on table change event criteria with specified code 'BAREA'
     * @param tableChangeEvent
     */
    public browseBusinessAreas(tableChangeEvent: TableChangeEvent): Observable<BrowseResponse<BusinessArea>> {
        let filters = [];
        let sort = [];
        let limit = 15;
        let offset = 0;

        if (tableChangeEvent) {
            limit = tableChangeEvent.pageSize;
            offset = tableChangeEvent.pageIndex * tableChangeEvent.pageSize;
            filters = Object.values(tableChangeEvent.filters);
            filters.forEach((filter: any): any => filter.property = StringUtils.convertCamelToSnakeUpper(filter.property));
            if (tableChangeEvent.sortActive && tableChangeEvent.sortDirection) {
                sort = [
                    new Sort(tableChangeEvent.sortActive, tableChangeEvent.sortDirection)
                ];
            }
            filters.push(new Filter('CODE', 'BAREA'));
        }

        return this.browseWithSummary(PostContent.create(limit, offset, filters, sort));
    }

    /**
     * Get list of business area objects
     */
    public listBusinessAreas(): Observable<BrowseResponse<BusinessArea>> {
        const limit = 100;

        return this.browseWithSummary(PostContent.create(limit, 0, [], []));
    }

    /**
     * Get list of source of agenda objects by code value 'ASO'
     */
    public listSourceOfAgendas(): Observable<BrowseResponse<SourceOfAgenda>> {
        return this.getListByCode('ASO');
    }

    /**
     * Get list of source of agenda objects by code value 'COUNTRY'
     */
    public listCountries(): Observable<BrowseResponse<Country>> {
        return this.getListByCode('COUNTRY');
    }

    /**
     * Get list of category objects by code value 'CAT'
     */
    public listCategories(): Observable<BrowseResponse<Category>> {
        return this.getListByCode('CAT');
    }

    /**
     * Get list of subcategory objects
     */
    public listSubCategories(categoryId: number): Observable<SubCategory[]> {
        return this.http.get<SubCategory[]>(`${environment.URL_API}/codeList/${this.projectEventService.instant.id}/${categoryId}`, {headers: this.getHeader()});
    }

    /**
     * Get list of organizations
     */
    public listOrganizations(): Observable<CodelistItem[]> {
        return this.http.get<CodelistItem[]>(`${environment.URL_API}/organizations`, {headers: this.getHeader()})
            .pipe(shareReplay());
    }

    /**
     * Get list of business areas for the guideline section
     */
    public listGuidelineBusinessAreas(projectId: number): Observable<BusinessArea[]> {
        return this.http.get<BusinessArea[]>(`${environment.URL_API}/codeList/guideline/${projectId}`,
            {headers: this.getHeader()}
        )
            .pipe(
                map((businessAreas: BusinessArea[]): BusinessArea[] =>
                    businessAreas.filter((businessArea: BusinessArea) => businessArea.state === `VALID`)
                )
            );
    }

    /**
     * Browse list of objects from code list by code value
     * @param code
     */
    private getListByCode(code: string): Observable<BrowseResponse<any>> {
        const limit = 100;

        return this.browseWithSummary(PostContent.create(limit, 0, [new Filter('CODE', code)], []))
            .pipe(
                shareReplay(),
            );
    }
}
