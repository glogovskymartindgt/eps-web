import { Component, OnInit } from '@angular/core';
import { fadeEnterLeave, moveDown, moveLeft, routeAnimations } from '../../../shared/hazlenut/hazelnut-common/animations';
import { HazelnutConfig } from '../../../shared/hazlenut/hazelnut-common/config/hazelnut-config';
import { AuthService } from '../../../shared/services/auth.service';
import { ProjectUserService } from '../../../shared/services/storage/project-user.service';

@Component({
    selector: 'iihf-admin-layout',
    templateUrl: './admin-layout.component.html',
    styleUrls: ['./admin-layout.component.scss'],
    animations: [fadeEnterLeave, routeAnimations, moveDown, moveLeft],
})
export class AdminLayoutComponent implements OnInit {
    public language = HazelnutConfig.LANGUAGE;
    public data;
    public login = '';

    public constructor(public readonly projectUserService: ProjectUserService,
                       private readonly authService: AuthService) {
    }

    public ngOnInit() {
        this.projectUserService.subject.login.subscribe((login) => {
            this.login = login;
        });
    }

    /**
     * Logout from app and navigate to login screen
     */
    public logout(): void {
        this.authService.logout();
        this.projectUserService.clearUserData();
    }

}
