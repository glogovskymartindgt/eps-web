import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HazelnutConfig } from '../hazlenut/hazelnut-common/config/hazelnut-config';
import { NotificationService } from './notification.service';
import { ProjectUserService } from './project-user.service';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    public constructor(private readonly httpClient: HttpClient,
                       private readonly userService: ProjectUserService,
                       private readonly notificationService: NotificationService,
                       private readonly router: Router,
    ) {
    }

    public login(loginName: string, password: string) {
        console.log('call login');
        this.loginBackend(loginName, password);
    }

    public logout(): void {
        this.logoutBackend(this.userService.instant.masterToken,
            this.userService.instant.authToken,
            this.userService.instant.deviceId);
    }

    private loginBackend(login: string, password: string, deviceId = 'device1'): void {
        const headers = new HttpHeaders({'Content-Type': 'application/json'});
        this.httpClient.post(
            HazelnutConfig.URL_API + '/security/authenticate',
            {login, password, deviceId},
            {headers}
        ).subscribe((data) => {
                this.userService.setAuthData(data);
                this.router.navigate(['tasks/list']);
            },
            // (error) => this.notificationService.openErrorNotification(error)
        );
    }

    private logoutBackend(masterToken: string, authenticationToken: string, deviceId = 'device1'): void {
        const headers = new HttpHeaders({'Content-Type': 'application/json'});
        this.httpClient.post(
            HazelnutConfig.URL_API + '/security/invalidate',
            {masterToken, authenticationToken, deviceId},
            {headers}
        ).subscribe((data) => {
                this.userService.clearUserData();
                // this.notificationService.openErrorNotification('info.logoutSuccessful');
                this.router.navigate(['authentication/login']);
            }
            // ,(error) => this.notificationService.openErrorNotification(error)
        );
    }
}
