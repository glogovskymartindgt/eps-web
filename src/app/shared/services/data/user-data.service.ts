import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../interfaces/user.interface';
import { NotificationService } from '../notification.service';
import { ProjectService } from '../project.service';
import { ProjectUserService } from '../storage/project-user.service';

@Injectable({
  providedIn: 'root'
})

/**
 * Fact service communicating with 'user' API url
 */
export class UserDataService extends ProjectService<User[]> {

    public constructor(http: HttpClient,
                       notificationService: NotificationService,
                       userService: ProjectUserService,
    ) {
        super(http, 'user', notificationService, userService);
    }

    /**
     * Get users object from API
     */
    public getUsers(): Observable<User[]> {
        return this.getDetail('');
    }
}
