import { TranslateService } from '@ngx-translate/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { NotificationService } from './notification.service';
import { ProjectEventService } from './storage/project-event.service';
import { ProjectUserService } from './storage/project-user.service';

@Injectable({
    providedIn: 'root'
})

/**
 * Service for authentification
 */
export class AuthService {
    public constructor(private readonly httpClient: HttpClient,
                       private readonly userService: ProjectUserService,
                       private readonly notificationService: NotificationService,
                       private readonly router: Router,
                       private readonly projectEventService: ProjectEventService,
    ) {
    }

    /**
     * Login wrapper function
     * @param loginName
     * @param password
     */
    public login(loginName: string, password: string) {
        this.loginBackend(loginName, password);
    }

    /**
     * Logout wrapper function
     */
    public logout(): void {
        this.logoutBackend(this.userService.instant.masterToken,
            localStorage.userData ? JSON.parse(localStorage.userData).authToken : '',
            this.userService.instant.deviceId);
    }

    /**
     * Login API function with saving user into local storage and navigate to dashboard screen
     * @param login
     * @param password
     * @param deviceId
     */
    private loginBackend(login: string, password: string, deviceId = 'device1'): void {
        const headers = new HttpHeaders({'Content-Type': 'application/json'});

        this.httpClient.post(
            environment.URL_API + '/security/authenticate',
            {login, password, deviceId},
            {headers}
        ).subscribe((data) => {
                this.userService.setAuthData(data);
                this.projectEventService.setEventData();
                this.router.navigate(['dashboard']);
            }
        );
    }

    /**
     * Logout API function
     * @param masterToken
     * @param authenticationToken
     * @param deviceId
     */
    private logoutBackend(masterToken: string, authenticationToken: string, deviceId = 'device1'): void {
        const headers = new HttpHeaders({'Content-Type': 'application/json'});

        this.projectEventService.setEventData();
        this.httpClient.post(
            environment.URL_API + '/security/invalidate',
            {masterToken, authenticationToken, deviceId},
            {headers}
        ).subscribe((data) => {
                this.userService.clearUserData();
                this.router.navigate(['authentication/login']);
            }
            , (error) => {
                this.router.navigate(['authentication/login']);
                this.notificationService.openErrorNotification('error.logout');
            }
        );
    }

}
