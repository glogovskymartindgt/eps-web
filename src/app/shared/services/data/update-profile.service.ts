import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Profile } from '../../models/profile.model.';
import { NotificationService } from '../notification.service';
import { ProjectService } from '../project.service';
import { ProjectUserService } from '../storage/project-user.service';

@Injectable({
    providedIn: 'root'
})
export class UpdateProfileService extends ProjectService<Profile> {

    public constructor(http: HttpClient, notificationService: NotificationService, userService: ProjectUserService) {
        super(http, 'user/profile', notificationService, userService);
    }

    public updateProfile(id: number, detail: Profile): Observable<Profile> {
        return this.update(id, detail);
    }

}
