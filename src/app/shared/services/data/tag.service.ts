import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Filter, TableChangeEvent } from '@hazelnut';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BrowseResponse, PostContent } from '../../hazelnut/hazelnut-common/models';
import { TagInterface } from '../../interfaces/tag.interface';
import { Tag } from '../../models/tag.model';
import { NotificationService } from '../notification.service';
import { ProjectService } from '../project.service';
import { ProjectUserService } from '../storage/project-user.service';

@Injectable({
    providedIn: 'root'
})
export class TagService extends ProjectService<TagInterface> {

    public constructor(http: HttpClient, notificationService: NotificationService, userService: ProjectUserService) {
        super(http, 'tag', notificationService, userService);
    }

    public getTags(): Observable<BrowseResponse<Tag>> {
        const filters = [];
        const sort = [];

        return this.browseWithSummary(PostContent.create(NaN, NaN, filters, sort));
    }


    /**
     * Ger task objects from API based on criteria
     * @param tableChangeEvent - request parameters from a table
     * @param additionalFilters - additional filters on top of the table request
     */
    public browseTags(tableChangeEvent: TableChangeEvent, additionalFilters: Filter[]): Observable<BrowseResponse<TagInterface>> {
        const request: PostContent = PostContent.createForIihf(tableChangeEvent);
        request.addFilters(...additionalFilters);

        return this.browseWithSummary(request, '/brw/', false)
            .pipe(
                catchError(this.processError)
            );
    }

    /**
     * Delete task object with API call
     * @param id
     */
    public deleteTag(id: number): any {
        return this.deleteById(id);
    }

    public updateTag(tagId: number, factItemType: TagInterface): Observable<TagInterface> {
        return this.update(tagId, factItemType)
            .pipe(
                catchError(this.processError)
            );
    }

    public getTag(factItemTypeId = 1): any {
        return this.getDetail(factItemTypeId);
    }

    private readonly processError = (error: Error): Observable<never> => {
        this.notificationService.openErrorNotification('error.api');

        throw error;
    }

}
