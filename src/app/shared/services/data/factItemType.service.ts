import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BrowseResponse, Filter, PostContent, TableChangeEvent } from '@hazelnut';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { FactItemType } from '../../interfaces/fact-item-type';
import { NotificationService } from '../notification.service';
import { ProjectService } from '../project.service';
import { ProjectUserService } from '../storage/project-user.service';

@Injectable({
    providedIn: 'root'
})
export class FactItemTypeService extends ProjectService<FactItemType> {

    public constructor(http: HttpClient, notificationService: NotificationService, userService: ProjectUserService) {
        super(http, 'factItemType', notificationService, userService);
    }

    /**
     * Ger task objects from API based on criteria
     * @param tableChangeEvent - request parameters from a table
     * @param additionalFilters - additional filters on top of the table request
     */
    public browseFactItemTypes(tableChangeEvent: TableChangeEvent, additionalFilters: Filter[]): Observable<BrowseResponse<FactItemType>> {
        const request: PostContent = PostContent.createForIihf(tableChangeEvent);
        request.addFilters(...additionalFilters);

        return this.browseWithSummary(request)
            .pipe(
                catchError(this.processError)
            );
    }

    public createFactItemType(factItemType: FactItemType): Observable<FactItemType> {
        return this.add<FactItemType>(factItemType)
            .pipe(
                catchError(this.processError)
            );
    }

    public updateFactItemType(factItemTypeId: number, factItemType: FactItemType): Observable<FactItemType> {
        return this.update(factItemTypeId, factItemType)
            .pipe(
                catchError(this.processError)
            );
    }

    public getFactItemType(factItemTypeId = 1): Observable<FactItemType> {
        return this.getDetail(factItemTypeId);
    }

    private readonly processError = (error: Error): Observable<never> => {
        this.notificationService.openErrorNotification('error.api');

        throw error;
    }
}
