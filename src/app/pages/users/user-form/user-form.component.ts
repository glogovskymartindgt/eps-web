import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { Role } from '../../../shared/enums/role.enum';
import { BrowseResponse } from '../../../shared/hazelnut/hazelnut-common/models';
import { Regex } from '../../../shared/hazelnut/hazelnut-common/regex/regex';
import { ProjectInterface } from '../../../shared/interfaces/project.interface';
import { User } from '../../../shared/interfaces/user.interface';
import { Group } from '../../../shared/models/group.model';
import { Project } from '../../../shared/models/project.model';
import { AuthService } from '../../../shared/services/auth.service';
import { DashboardService } from '../../../shared/services/dashboard.service';
import { GroupService } from '../../../shared/services/data/group.service';
import { ImagesService } from '../../../shared/services/data/images.service';
import { UserDataService } from '../../../shared/services/data/user-data.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { AppConstants } from '../../../shared/utils/constants';

@Component({
    selector: 'iihf-user-form',
    templateUrl: './user-form.component.html',
    styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {
    @Output() public readonly formDataChange = new EventEmitter<any>();
    public userForm: FormGroup;
    public notOnlyWhiteCharactersPattern = Regex.notOnlyWhiteCharactersPattern;
    public emailPattern = Regex.emailPattern;
    public hidePassword = true;
    public isUpdate = false;
    public groupList = [];
    public userGroups = [];
    public projectList = [];
    public userImageSrc: any = AppConstants.defaultAvatarPath;
    public userPasswordPattern = Regex.userPassword;
    public loginStringPattern = Regex.loginStringPattern;

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
        this.userForm.controls.id.patchValue(user.id);
        this.userForm.controls.firstName.patchValue(user.firstName);
        this.userForm.controls.lastName.patchValue(user.lastName);
        this.userForm.controls.email.patchValue(user.email);
        this.userForm.controls.password.patchValue(user.password);
        this.userForm.controls.login.patchValue(user.login);
        this.userForm.controls.isVisible.patchValue(user.isVisible);
        this.userForm.controls.state.patchValue(user.state === 'ACTIVE');
        this.userForm.controls.type.patchValue(user.type);
        this.userForm.controls.groupIdList.patchValue(user.groupIdList);
        this.userForm.controls.projectIdList.patchValue(user.projectIdList);
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
    }

    private getIdFromRouteParamsAndSetDetail(param: any): void {
        this.userDataService.getUserDetail(param.id)
            .subscribe((apiUser: User): void => {
                this.setForm(apiUser);
            }, (error: any): any => this.notificationService.openErrorNotification(error));
    }

    private createForm(): void {
        this.userForm = this.formBuilder.group({
            id: [''],
            isVisible: [''],
            firstName: [
                '',
                Validators.required
            ],
            lastName: [
                '',
                Validators.required
            ],
            email: [''],
            login: [
                '',
            ],
            password: ['', ],
            type: [
                '',
                Validators.required
            ],
            state: [''],
            groupIdList: [''],
            projectIdList: [''],
        });
        this.userForm.controls.id.disable();
        this.userForm.controls.firstName.setValidators(Validators.required);
        this.userForm.controls.lastName.setValidators(Validators.required);
        this.userForm.controls.login.setValidators(Validators.required);
        this.userForm.controls.type.setValidators(Validators.required);
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
