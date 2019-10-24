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
export class ProfileService extends ProjectService<Profile> {

    public constructor(http: HttpClient, notificationService: NotificationService, userService: ProjectUserService, ) {
        super(http, 'profile', notificationService, userService);
    }

    public getProfileById(id: number): Observable<Profile> {
        return this.getDetail(id);
    }
}
