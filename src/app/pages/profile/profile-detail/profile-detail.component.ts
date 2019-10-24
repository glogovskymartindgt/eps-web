import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Profile } from '../../../shared/models/profile.model.';
import { ImagesService } from '../../../shared/services/data/images.service';
import { ProfileService } from '../../../shared/services/data/profile.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { ProjectEventService } from '../../../shared/services/storage/project-event.service';

@Component({
    selector: 'profile-detail',
    templateUrl: './profile-detail.component.html',
    styleUrls: ['./profile-detail.component.scss']
})
export class ProfileDetailComponent implements OnInit {

    public profileDetailForm: FormGroup;
    public imageSrc;

    public constructor(private readonly formBuilder: FormBuilder,
                       private readonly imagesService: ImagesService,
                       private readonly notificationService: NotificationService,
                       private readonly profileService: ProfileService,
                       private readonly projectEventService: ProjectEventService) {
    }

    public ngOnInit(): void {
        this.initializeFrom();
        this.loadProfileDetail();
    }

    public onImageChanged(event): void {
        const file = event.target.files[0];
        if (!file) {
            return;
        }
        const reader = new FileReader();
        reader.onload = () => {
            this.imageSrc = reader.result;
            this.imagesService.uploadImages([file])
                .subscribe((data) => {
                    this.profileDetailForm.controls.avatarUploadId.patchValue(data.fileNames[file.name].replace(/^.*[\\\/]/, ''));
                }, () => {
                    this.notificationService.openErrorNotification('error.imageUpload');
                });
        };
        reader.readAsDataURL(file);
    }

    public onSave(): void {

    }

    public onCancel(): void {

    }

    private initializeFrom(): void {
        this.profileDetailForm = this.formBuilder.group({
            avatar: [''],
            avatarUploadId: [''],
            firstName: [''],
            lastName: [''],
            email: [''],
            login: [''],
            password: [''],
            active: [''],
        });
        this.profileDetailForm.controls.login.disable();
    }

    private loadProfileDetail() {
        // TODO id is project id, we need profile id
        console.log('profile', this.projectEventService.instant.id);
        this.profileService.getProfileById(this.projectEventService.instant.id)
            .subscribe((data) => {
                console.log(data);
                this.setFormWithDetailData(data);
            }, () => {
                this.notificationService.openErrorNotification('error.getProjectDetail');
            });
    }

    private setFormWithDetailData(projectDetail: Profile) {

    }

}
