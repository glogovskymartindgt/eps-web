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

enum FormControlNames {
    avatar = 'avatar',
    firstName = 'firstName',
    lastName = 'lastName',
    mobile = 'mobile',
    phone = 'phone',
    function = 'function',
    email = 'email',
    login = 'login',
    password = 'password',
    state = 'state',
}

@Component({
    selector: 'iihf-profile-detail',
    templateUrl: './profile-detail.component.html',
    styleUrls: ['./profile-detail.component.scss'],
    animations: [enterLeave]
})
export class ProfileDetailComponent implements OnInit {

    public profileDetailForm: FormGroup;
    public readonly userPasswordPattern = Regex.userPassword;
    public readonly notOnlyWhiteCharactersPattern = Regex.notOnlyWhiteCharactersPattern;
    public readonly emailPattern = Regex.emailPattern;
    public readonly phonePattern = Regex.internationalPhonePattern;
    public readonly formControlNames: typeof FormControlNames = FormControlNames;
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
        profileObject[this.formControlNames.firstName] = this.profileDetailForm.get(this.formControlNames.firstName).value;
        profileObject[this.formControlNames.lastName] = this.profileDetailForm.get(this.formControlNames.lastName).value;
        profileObject[this.formControlNames.email] = this.profileDetailForm.get(this.formControlNames.email).value;
        profileObject[this.formControlNames.phone] = this.profileDetailForm.get(this.formControlNames.phone).value;
        profileObject[this.formControlNames.mobile] = this.profileDetailForm.get(this.formControlNames.mobile).value;
        profileObject[this.formControlNames.function] = this.profileDetailForm.get(this.formControlNames.function).value;
        if (this.avatarSource) {
            profileObject[this.formControlNames.avatar] = this.profileDetailForm.get(this.formControlNames.avatar).value;
        }
        if (this.profileDetailForm.get(this.formControlNames.password) && this.profileDetailForm.get(this.formControlNames.password).value.length > 0) {
            profileObject[this.formControlNames.password] = this.profileDetailForm.get(this.formControlNames.password).value;
        }
        this.updateProfileService.updateProfile(this.projectUserService.instant.userId, profileObject)
            .subscribe((): any => {
                if (profileObject[this.formControlNames.avatar]) {
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
            [this.formControlNames.avatar]: [''],
            [this.formControlNames.firstName]: [''],
            [this.formControlNames.lastName]: [''],
            [this.formControlNames.email]: [''],
            [this.formControlNames.phone]: ['', Validators.required],
            [this.formControlNames.mobile]: ['', Validators.required],
            [this.formControlNames.function]: ['', Validators.required],
            [this.formControlNames.login]: [''],
            [this.formControlNames.password]: [
                '',
                Validators.compose([
                    Validators.pattern(this.userPasswordPattern),
                    Validators.maxLength(passwordInputLength)
                ])
            ],
            [this.formControlNames.state]: [''],
        });
        this.profileDetailForm.get(this.formControlNames.login).disable();
        this.profileDetailForm.get(this.formControlNames.state).disable();
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
        this.profileDetailForm.get(this.formControlNames.firstName).patchValue(projectDetail.firstName);
        this.profileDetailForm.get(this.formControlNames.lastName).patchValue(projectDetail.lastName);
        this.profileDetailForm.get(this.formControlNames.phone).patchValue(projectDetail.phone);
        this.profileDetailForm.get(this.formControlNames.mobile).patchValue(projectDetail.mobile);
        this.profileDetailForm.get(this.formControlNames.function).patchValue(projectDetail.function);
        this.profileDetailForm.get(this.formControlNames.email).patchValue(projectDetail.email);
        this.profileDetailForm.get(this.formControlNames.login).patchValue(projectDetail.login);
        this.profileDetailForm.get(this.formControlNames.state).patchValue(projectDetail.state);
        this.profileDetailForm.get(this.formControlNames.avatar).patchValue(projectDetail.avatar);
    }
}
