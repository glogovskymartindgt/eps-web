import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Role } from '../../../shared/enums/role.enum';
import { fadeEnterLeave, moveDown, moveLeft, routeAnimations } from '../../../shared/hazlenut/hazelnut-common/animations';
import { hazelnutConfig } from '../../../shared/hazlenut/hazelnut-common/config/hazelnut-config';
import { AuthService } from '../../../shared/services/auth.service';
import { ImagesService } from '../../../shared/services/data/images.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { ProjectUserService } from '../../../shared/services/storage/project-user.service';
import { UserPhotoService } from '../../../shared/services/user-photo.service';

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

    public constructor(public readonly projectUserService: ProjectUserService,
                       private readonly authService: AuthService,
                       private readonly router: Router,
                       public readonly userPhotoService: UserPhotoService,
                       private readonly imagesService: ImagesService,
                       private readonly notificationService: NotificationService) {
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

    public openProfile(): void {
        this.router.navigate(['profile']);
    }

    public hasRoleReadOwnUser(): boolean {
        return this.authService.hasRole(Role.RoleReadOwnUser);
    }

    public toImageUrl(filePath: string) {
        this.imagesService.getImage(filePath)
            .subscribe((blob) => {
                const reader = new FileReader();
                reader.onload = () => {
                    (reader.result);
                };
                reader.readAsDataURL(blob);
            }, () => {
                this.notificationService.openErrorNotification('error.imageDownload');
            });
    }

}
