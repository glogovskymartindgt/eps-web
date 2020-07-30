import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Role } from '../../../shared/enums/role.enum';
import { fadeEnterLeave, moveDown, moveLeft, routeAnimations } from '../../../shared/hazelnut/hazelnut-common/animations';
import { hazelnutConfig } from '../../../shared/hazelnut/hazelnut-common/config/hazelnut-config';
import { AuthService } from '../../../shared/services/auth.service';
import { ProjectUserService } from '../../../shared/services/storage/project-user.service';

@Component({
    selector: 'iihf-admin-layout',
    templateUrl: './admin-layout.component.html',
    styleUrls: ['./admin-layout.component.scss'],
    animations: [
        fadeEnterLeave,
        routeAnimations,
        moveDown,
        moveLeft
    ],
})
export class AdminLayoutComponent implements OnInit {
    public language = hazelnutConfig.LANGUAGE;
    public data;
    public login = '';
    public avatar$: Observable<string>;

    public constructor(public readonly projectUserService: ProjectUserService, private readonly authService: AuthService, private readonly router: Router) {
    }

    public ngOnInit(): void {
        this.projectUserService.subject.login.subscribe((login: string): void => {
            this.login = login;
        });
        this.avatar$ = this.projectUserService.subject.avatar;
    }

    /**
     * Logout from app and navigate to login screen
     */
    public logout(): void {
        this.authService.logoutBackend();
        this.projectUserService.clearUserData();
    }

    public openProfile(): void {
        this.router.navigate(['profile']);
    }

    public hasRoleReadOwnUser(): boolean {
        return this.authService.hasRole(Role.RoleReadOwnUser);
    }

}
