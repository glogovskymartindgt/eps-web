import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ImagesService } from './data/images.service';
import { ProfileService } from './data/profile.service';
import { NotificationService } from './notification.service';
import { ProjectUserService } from './storage/project-user.service';

@Injectable({
    providedIn: 'root'
})
export class UserPhotoService {
    public userPhoto = new BehaviorSubject<any>('assets/img/avatar.svg');

    public constructor(private readonly profileService: ProfileService,
                       private readonly imagesService: ImagesService,
                       private readonly notificationService: NotificationService,
                       private readonly projectUserService: ProjectUserService) {
    }

    public changePhoto(filePath: string): void {
        this.projectUserService.setProperty('avatar', filePath);
        this.imagesService.getImage(filePath)
            .subscribe((blob) => {
                const reader = new FileReader();
                reader.onload = () => {
                    this.userPhoto.next(reader.result);
                };
                reader.readAsDataURL(blob);
            }, () => {
                this.notificationService.openErrorNotification('error.imageDownload');
            });
    }

}
