import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { enterLeave } from '../../../shared/hazelnut/hazelnut-common/animations';
import { Regex } from '../../../shared/hazelnut/hazelnut-common/regex/regex';
import { Profile } from '../../../shared/models/profile.model.';
import { FileService } from '../../../shared/services/core/file.service';
import { ImagesService } from '../../../shared/services/data/images.service';
import { ProfileService } from '../../../shared/services/data/profile.service';
import { UpdateProfileService } from '../../../shared/services/data/update-profile.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { ProjectUserService } from '../../../shared/services/storage/project-user.service';
import { AppConstants } from '../../../shared/utils/constants';

@Component({
    selector: 'iihf-profile-detail',
    templateUrl: './profile-detail.component.html',
    styleUrls: ['./profile-detail.component.scss'],
    animations: [enterLeave]
})
export class ProfileDetailComponent implements OnInit {

    public profileDetailForm: FormGroup;
    public imageSrc: any = AppConstants.defaultAvatarPath;
    public userPasswordPattern = Regex.userPassword;
    public notOnlyWhiteCharactersPattern = Regex.notOnlyWhiteCharactersPattern;
    public emailPattern = Regex.emailPattern;
    public hidePassword = true;

    public constructor(private readonly formBuilder: FormBuilder,
                       private readonly imagesService: ImagesService,
                       private readonly notificationService: NotificationService,
                       private readonly profileService: ProfileService,
                       private readonly projectUserService: ProjectUserService,
                       private readonly updateProfileService: UpdateProfileService,
                       private readonly location: Location,
                       private readonly fileService: FileService) {
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
        reader.onload = (): void => {
            this.imageSrc = reader.result;
            this.imagesService.uploadImages([file])
                .subscribe((data: any): void => {
                    this.profileDetailForm.controls.avatarUploadId.patchValue(data.fileNames[file.name].replace(/^.*[\\\/]/, ''));
                }, (): void => {
                    this.notificationService.openErrorNotification('error.imageUpload');
                });
        };
        reader.readAsDataURL(file);
    }

    public onSave(): void {
        const profileObject = new Profile();
        profileObject.firstName = this.profileDetailForm.controls.firstName.value;
        profileObject.lastName = this.profileDetailForm.controls.lastName.value;
        profileObject.email = this.profileDetailForm.controls.email.value;
        if (this.profileDetailForm.controls.password && this.profileDetailForm.controls.password.value.length > 0) {
            profileObject.password = this.profileDetailForm.controls.password.value;
        }
        if (this.profileDetailForm.controls.avatarUploadId && this.profileDetailForm.controls.avatarUploadId.value.length > 0) {
            profileObject.avatar = this.profileDetailForm.controls.avatarUploadId.value;
        }
        this.updateProfileService.updateProfile(this.projectUserService.instant.userId, profileObject)
            .subscribe((): void => {
                if (profileObject.avatar) {
                    this.imagesService.getImage(profileObject.avatar)
                        .subscribe((blob: Blob): void => {
                            const reader = new FileReader();
                            reader.onload = (): void => {
                                this.projectUserService.setProperty('avatar', (reader.result) as string);
                            };
                            reader.readAsDataURL(blob);
                        }, (): void => {
                            this.notificationService.openErrorNotification('error.imageDownload');
                        });
                }
                this.location.back();
            }, (): void => this.notificationService.openErrorNotification('error.profileUpdateFailed'));
    }

    public onCancel(): void {
        this.location.back();
    }

    private initializeFrom(): void {
        const passwordInputLength = 50;
        this.profileDetailForm = this.formBuilder.group({
            avatar: [''],
            avatarUploadId: [''],
            firstName: [''],
            lastName: [''],
            email: [''],
            login: [''],
            password: [
                '',
                Validators.compose([
                    Validators.pattern(this.userPasswordPattern),
                    Validators.maxLength(passwordInputLength)
                ])
            ],
            state: [''],
        });
        this.profileDetailForm.controls.login.disable();
    }

    private loadProfileDetail(): void {
        this.profileService.getProfileById(this.projectUserService.instant.userId)
            .subscribe((data: Profile): void => {
                this.setFormWithDetailData(data);
            }, (): void => {
                this.notificationService.openErrorNotification('error.getProjectDetail');
            });
    }

    private setFormWithDetailData(projectDetail: Profile): void {
        this.profileDetailForm.controls.firstName.patchValue(projectDetail.firstName);
        this.profileDetailForm.controls.lastName.patchValue(projectDetail.lastName);
        this.profileDetailForm.controls.email.patchValue(projectDetail.email);
        this.profileDetailForm.controls.login.patchValue(projectDetail.login);
        this.profileDetailForm.controls.state.patchValue(projectDetail.state);
        if (!projectDetail.avatar) {
            this.imageSrc = AppConstants.defaultAvatarPath;
        } else {
            this.profileDetailForm.controls.avatarUploadId.patchValue(projectDetail.avatar);
            this.imagesService.getImage(projectDetail.avatar)
                .subscribe((blob: Blob): void => {
                    this.fileService.readFile(blob, (result: string): void => {
                        this.projectUserService.setProperty('avatar', result);
                        this.imageSrc = result;
                    });
                }, (): void => {
                    this.notificationService.openErrorNotification('error.imageDownload');
                });
        }
    }

}
