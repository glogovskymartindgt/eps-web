import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { Role } from '../../../shared/enums/role.enum';
import { BrowseResponse } from '../../../shared/hazelnut/hazelnut-common/models';
import { Regex } from '../../../shared/hazelnut/hazelnut-common/regex/regex';
import { ProjectInterface } from '../../../shared/interfaces/project.interface';
import { User } from '../../../shared/interfaces/user.interface';
import { CodelistItem } from '../../../shared/models/codelist-item.model';
import { Group } from '../../../shared/models/group.model';
import { Project } from '../../../shared/models/project.model';
import { AuthService } from '../../../shared/services/auth.service';
import { DashboardService } from '../../../shared/services/dashboard.service';
import { GroupService } from '../../../shared/services/data/group.service';
import { ImagesService } from '../../../shared/services/data/images.service';
import { UserDataService } from '../../../shared/services/data/user-data.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { AppConstants } from '../../../shared/utils/constants';

enum FormControlNames {
    id = 'id',
    isVisible = 'isVisible',
    firstName = 'firstName',
    lastName = 'lastName',
    email = 'email',
    mobile = 'mobile',
    phone = 'phone',
    organization = 'organization',
    function = 'function',
    login = 'login',
    password = 'password',
    type = 'type',
    state = 'state',
    groupIdList = 'groupIdList',
    projectIdList = 'projectIdList',
}

@Component({
    selector: 'iihf-user-form',
    templateUrl: './user-form.component.html',
    styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {
    @Input()
    public organizations: CodelistItem[] = [];

    @Output() public readonly formDataChange = new EventEmitter<any>();
    public userForm: FormGroup;

    public hidePassword = true;
    public isUpdate = false;
    public groupList = [];
    public userGroups = [];
    public projectList = [];
    public userImageSrc: any = AppConstants.defaultAvatarPath;

    public readonly notOnlyWhiteCharactersPattern = Regex.notOnlyWhiteCharactersPattern;
    public readonly emailPattern = Regex.emailPattern;
    public readonly userPasswordPattern = Regex.userPassword;
    public readonly loginStringPattern = Regex.loginStringPattern;
    public readonly phonePattern = Regex.internationalPhonePattern;

    public readonly formControlNames: typeof FormControlNames = FormControlNames;

    public constructor(private readonly formBuilder: FormBuilder,
                       private readonly userDataService: UserDataService,
                       private readonly notificationService: NotificationService,
                       private readonly activatedRoute: ActivatedRoute,
                       private readonly groupService: GroupService,
                       private readonly dashboardService: DashboardService,
                       private readonly authService: AuthService,
                       private readonly imagesService: ImagesService) {
    }

    public ngOnInit(): void {
        this.initializeGroups();
        this.initializeProjects();
        this.createForm();
        this.checkIfUpdate();
    }

    public hasRoleAssignGroup(): boolean {
        return this.authService.hasRole(Role.RoleAssignGroup);
    }

    public hasRoleUnAssignGroup(): boolean {
        return this.authService.hasRole(Role.RoleUnassignGroup);
    }

    public canEditGroupOption(groupId: number): boolean {
        const haveAssignAndUnAssignRoles = this.hasRoleAssignGroup() && this.hasRoleUnAssignGroup();
        const checkedAndCantUnAssign = this.userGroups.includes(groupId) && !this.hasRoleUnAssignGroup();
        const uncheckedAndCantAssign = !this.userGroups.includes(groupId) && !this.hasRoleAssignGroup();

        return haveAssignAndUnAssignRoles || !(checkedAndCantUnAssign || uncheckedAndCantAssign);
    }

    public trackGroupIdBySelf(index: number, item: number): any {
        return item;
    }

    public trackProjectById(index: number, item: Project): any {
        return item.id;
    }

    public trackById(index: number, item: { id: number }): number {
        return item.id;
    }

    private checkIfUpdate(): void {
        this.activatedRoute.queryParams.subscribe((param: Params): void => {
            if (Object.keys(param).length > 0) {
                this.isUpdate = true;
                this.userForm.controls.login.disable();
                this.getIdFromRouteParamsAndSetDetail(param);
            }
            const passwordMaxLength = 50;
            if (!this.isUpdate) {
                this.userForm.controls.password.setValidators(Validators.compose([
                    Validators.required,
                    Validators.pattern(this.userPasswordPattern),
                    Validators.maxLength(passwordMaxLength)
                ]));
            } else {
                this.userForm.controls.password.setValidators(Validators.compose([
                    Validators.pattern(this.userPasswordPattern),
                    Validators.maxLength(passwordMaxLength)
                ]));
            }
        });
    }

    private setForm(user: User): void {
        this.userForm.controls[FormControlNames.id].patchValue(user.id);
        this.userForm.controls[FormControlNames.firstName].patchValue(user.firstName);
        this.userForm.controls[FormControlNames.lastName].patchValue(user.lastName);
        this.userForm.controls[FormControlNames.email].patchValue(user.email);
        this.userForm.controls[FormControlNames.mobile].patchValue(user.mobile);
        this.userForm.controls[FormControlNames.phone].patchValue(user.phoneNumber);
        this.userForm.controls[FormControlNames.function].patchValue(user.function || '');
        this.userForm.controls[FormControlNames.password].patchValue(user.password);
        this.userForm.controls[FormControlNames.login].patchValue(user.login);
        this.userForm.controls[FormControlNames.isVisible].patchValue(user.isVisible);
        this.userForm.controls[FormControlNames.state].patchValue(user.state === 'ACTIVE');
        this.userForm.controls[FormControlNames.type].patchValue(user.type);
        this.userForm.controls[FormControlNames.groupIdList].patchValue(user.groupIdList);
        this.userForm.controls[FormControlNames.projectIdList].patchValue(user.projectIdList);
        if (user.avatar) {
            this.imagesService.getImage(user.avatar)
                .subscribe((blob: Blob): void => {
                    const reader = new FileReader();
                    reader.onload = (): void => {
                        this.userImageSrc = reader.result;
                    };
                    reader.readAsDataURL(blob);
                }, (): void => {
                    this.notificationService.openErrorNotification('error.imageDownload');
                });
        }
        this.userGroups = user.groupIdList ? user.groupIdList : [];
        if (user.organization) {
            const organizationId: number =
                this.organizations.find((organization: any): boolean => organization.name === user.organization).id;
            this.userForm.controls[FormControlNames.organization].patchValue(organizationId);
        }
    }

    private getIdFromRouteParamsAndSetDetail(param: any): void {
        this.userDataService.getUserDetail(param.id)
            .subscribe((apiUser: User): void => {
                this.setForm(apiUser);
            }, (error: any): any => this.notificationService.openErrorNotification(error));
    }

    private createForm(): void {
        this.userForm = this.formBuilder.group({
            [FormControlNames.id]: [''],
            [FormControlNames.isVisible]: [''],
            [FormControlNames.firstName]: [
                '',
                Validators.required
            ],
            [FormControlNames.lastName]: [
                '',
                Validators.required
            ],
            [FormControlNames.email]: [''],
            [FormControlNames.mobile]: ['', Validators.required],
            [FormControlNames.phone]: ['', Validators.required],
            [FormControlNames.organization]: ['', Validators.required],
            [FormControlNames.function]: ['', Validators.required],
            [FormControlNames.login]: [
                '',
            ],
            [FormControlNames.password]: [''],
            [FormControlNames.type]: [
                '',
                Validators.required
            ],
            [FormControlNames.state]: [''],
            [FormControlNames.groupIdList]: [''],
            [FormControlNames.projectIdList]: [''],
        });
        this.userForm.controls[FormControlNames.id].disable();
        this.userForm.controls[FormControlNames.firstName].setValidators(Validators.required);
        this.userForm.controls[FormControlNames.lastName].setValidators(Validators.required);
        this.userForm.controls[FormControlNames.login].setValidators(Validators.required);
        this.userForm.controls[FormControlNames.type].setValidators(Validators.required);
        this.userForm.valueChanges.subscribe((): void => {
            this.emitFormDataChangeEmitter();
        });
    }

    private emitFormDataChangeEmitter(): void {
        if (this.userForm.invalid) {
            this.formDataChange.emit(null);
        } else {
            const actualValue = {
                ...this.userForm.value,
            };
            this.formDataChange.emit(actualValue);
        }
    }

    private initializeGroups(): void {
        this.groupService.browseGroups()
            .subscribe((groups: BrowseResponse<Group>): void => {
                this.groupList = groups.content;
            });
    }

    private initializeProjects(): void {
        this.dashboardService.filterProjects('ALL')
            .subscribe((data: ProjectInterface[]): void => {
                this.projectList = data;
            });
    }

}
