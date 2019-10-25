import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { Role } from '../enums/role.enum';
import { ImagesService } from './data/images.service';
import { NotificationService } from './notification.service';
import { ProjectEventService } from './storage/project-event.service';
import { ProjectUserService } from './storage/project-user.service';
import { UserPhotoService } from './user-photo.service';

@Injectable({
    providedIn: 'root'
})

/**
 * Service for authentification
 */ export class AuthService {
    public constructor(private readonly httpClient: HttpClient,
                       private readonly userService: ProjectUserService,
                       private readonly notificationService: NotificationService,
                       private readonly router: Router,
                       private readonly projectEventService: ProjectEventService,
                       private readonly projectUserService: ProjectUserService,
                       private readonly userPhotoService: UserPhotoService) {
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
        this.logoutBackend(this.userService.instant.masterToken, this.userService.instant.authToken, this.userService.instant.deviceId);
    }

    /**
     * Logged user role validation
     * @param {Role} role
     * @returns {boolean}
     */
    public hasRole(role: Role): boolean {
        const roles = this.projectUserService.instant.roles;
        return roles && roles.indexOf(role) >= 0;
    }

    /**
     * Login API function with saving user into local storage and navigate to dashboard screen
     * @param login
     * @param password
     * @param deviceId
     */
    private loginBackend(login: string, password: string, deviceId = 'device1'): void {
        const headers = new HttpHeaders({'Content-Type': 'application/json'});
        const accessDeniedCode = '9002';

        this.httpClient.post(environment.URL_API + '/security/authenticate', {
                login,
                password,
                deviceId
            }, {headers})
            .subscribe((data) => {
                this.userService.setAuthData(data);
                this.projectEventService.setEventData();
                this.router.navigate(['dashboard']);
            }, (error: HttpErrorResponse) => {
                if (error.error.code === accessDeniedCode) {
                    this.notificationService.openErrorNotification('error.loginData');
                } else {
                    this.notificationService.openErrorNotification('error.login');
                }
            });
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
        this.httpClient.post(environment.URL_API + '/security/invalidate', {
                masterToken,
                authenticationToken,
                deviceId
            }, {headers})
            .subscribe((data) => {
                this.userService.clearUserData();
                this.router.navigate(['authentication/login']);
            }, (error) => {
                this.router.navigate(['authentication/login']);
                this.notificationService.openErrorNotification('error.logout');
            });
    }

}
