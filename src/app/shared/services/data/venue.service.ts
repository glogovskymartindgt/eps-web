import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Venue } from '../../interfaces/venue.interface';
import { NotificationService } from '../notification.service';
import { ProjectService } from '../project.service';
import { ProjectUserService } from '../storage/project-user.service';

@Injectable({
  providedIn: 'root'
})

/**
 * Fact service communicating with 'venue' API url
 */
export class VenueService extends ProjectService<Venue[]> {

    public constructor(http: HttpClient,
                       notificationService: NotificationService,
                       userService: ProjectUserService,
    ) {
        super(http, 'venue', notificationService, userService);
    }

    /**
     * Get venue objects from API
     * @param projectId
     */
    public getVenuesByProjectId(projectId: number): Observable<Venue[]> {
        return this.getDetail(projectId);
    }

}
