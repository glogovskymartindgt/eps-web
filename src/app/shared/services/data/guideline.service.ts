import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BrowseResponse, Filter, PostContent, TableChangeEvent } from '@hazelnut';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Guideline } from '../../../pages/guidelines/guideline-list/guideline-list.component';
import { NotificationService } from '../notification.service';
import { ProjectService } from '../project.service';
import { ProjectUserService } from '../storage/project-user.service';

@Injectable({
    providedIn: 'root'
})
export class GuideLineService extends ProjectService<Guideline> {

    public constructor(http: HttpClient, notificationService: NotificationService, userService: ProjectUserService) {
        super(http, 'guidelines', notificationService, userService);
    }

    /**
     * Ger task objects from API based on criteria
     * @param tableChangeEvent - request parameters from a table
     * @param additionalFilters - additional filters on top of the table request
     */
    public browseGuidelines(tableChangeEvent: TableChangeEvent, additionalFilters: Filter[]): Observable<BrowseResponse<Guideline>> {
        const request: PostContent = PostContent.createForIihf(tableChangeEvent);
        request.addFilters(...additionalFilters);

        return this.browseWithSummary(request)
            .pipe(
                catchError(this.processError)
            );
    }

    public createGuideline(guideline: Guideline): Observable<Guideline> {
        return this.add<Guideline>(guideline)
            .pipe(
                catchError(this.processError)
            );
    }

    public getGuideline(guidelineId = 1): Observable<Guideline> {
        return this.getDetail(guidelineId);
    }

    private readonly processError = (error: Error): Observable<never> => {
        this.notificationService.openErrorNotification('error.api');

        throw error;
    }
}
