import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { enterLeave } from '../../../shared/hazelnut/hazelnut-common/animations';
import { Regex } from '../../../shared/hazelnut/hazelnut-common/regex/regex';
import { Profile } from '../../../shared/models/profile.model.';
import { ProfileService } from '../../../shared/services/data/profile.service';
import { UpdateProfileService } from '../../../shared/services/data/update-profile.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { ProjectUserService } from '../../../shared/services/storage/project-user.service';

@Component({
    selector: 'iihf-profile-detail',
    templateUrl: './profile-detail.component.html',
    styleUrls: ['./profile-detail.component.scss'],
    animations: [enterLeave]
})
export class ProfileDetailComponent implements OnInit {

    public profileDetailForm: FormGroup;
    public userPasswordPattern = Regex.userPassword;
    public notOnlyWhiteCharactersPattern = Regex.notOnlyWhiteCharactersPattern;
    public emailPattern = Regex.emailPattern;
    public hidePassword = true;

    private avatarSource: string = '';

    public constructor(private readonly formBuilder: FormBuilder,
                       private readonly notificationService: NotificationService,
                       private readonly profileService: ProfileService,
                       private readonly projectUserService: ProjectUserService,
                       private readonly updateProfileService: UpdateProfileService,
                       private readonly location: Location) {
    }

    public ngOnInit(): void {
        this.initializeFrom();
        this.loadProfileDetail();
    }

    public onSave(): void {
        const profileObject = new Profile();
        profileObject.firstName = this.profileDetailForm.controls.firstName.value;
        profileObject.lastName = this.profileDetailForm.controls.lastName.value;
        profileObject.email = this.profileDetailForm.controls.email.value;
        if (this.avatarSource) {
            profileObject.avatar = this.profileDetailForm.controls.avatar.value;
        }
        if (this.profileDetailForm.controls.password && this.profileDetailForm.controls.password.value.length > 0) {
            profileObject.password = this.profileDetailForm.controls.password.value;
        }
        this.updateProfileService.updateProfile(this.projectUserService.instant.userId, profileObject)
            .subscribe((): any => {
                if (profileObject.avatar) {
                    this.projectUserService.setProperty('avatar', this.avatarSource);
                }
                this.location.back();
            }, (): any => this.notificationService.openErrorNotification('error.profileUpdateFailed'));
    }

    public onCancel(): void {
        this.location.back();
    }

    public loadAvatarImage(avatarSource: string): void {
        this.avatarSource = avatarSource;
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

    private setFormWithDetailData(projectDetail: Profile): any {
        this.profileDetailForm.controls.firstName.patchValue(projectDetail.firstName);
        this.profileDetailForm.controls.lastName.patchValue(projectDetail.lastName);
        this.profileDetailForm.controls.email.patchValue(projectDetail.email);
        this.profileDetailForm.controls.login.patchValue(projectDetail.login);
        this.profileDetailForm.controls.state.patchValue(projectDetail.state);
        this.profileDetailForm.controls.avatar.patchValue(projectDetail.avatar);
    }
}
