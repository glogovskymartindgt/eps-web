import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from './notification.service';
import { ProjectUserService } from './project-user.service';
import { environment } from 'src/environments/environment';

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
            environment.URL_API + '/security/authenticate',
            {login, password, deviceId},
            {headers}
        ).subscribe((data) => {
                this.userService.setAuthData(data);
                this.router.navigate(['dashboard']);
            },
            (error) => this.notificationService.openErrorNotification('error.login')
        );
    }

    private logoutBackend(masterToken: string, authenticationToken: string, deviceId = 'device1'): void {
        const headers = new HttpHeaders({'Content-Type': 'application/json'});
        this.httpClient.post(
            environment.URL_API + '/security/invalidate',
            // {masterToken, authenticationToken, deviceId},
            {masterToken: masterToken, authenticationToken: authenticationToken, deviceId: deviceId},
            {headers}
        ).subscribe((data) => {
                this.userService.clearUserData();
                this.router.navigate(['authentication/login']);
            }
            , (error) => this.notificationService.openErrorNotification('error.logout')
        );
    }

}
