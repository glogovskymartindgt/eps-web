import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Role } from '../../../shared/enums/role.enum';
import { Regex } from '../../../shared/hazlenut/hazelnut-common/regex/regex';
import { ProjectInterface } from '../../../shared/interfaces/project.interface';
import { User } from '../../../shared/interfaces/user.interface';
import { AuthService } from '../../../shared/services/auth.service';
import { DashboardService } from '../../../shared/services/dashboard.service';
import { GroupService } from '../../../shared/services/data/group.service';
import { ImagesService } from '../../../shared/services/data/images.service';
import { UserDataService } from '../../../shared/services/data/user-data.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { AppConstants } from '../../../shared/utils/constants';

@Component({
    selector: 'user-form',
    templateUrl: './user-form.component.html',
    styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {
    @Output('formDataChange') public onFormDataChange = new EventEmitter<any>();
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

    public ngOnInit() {
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

    private checkIfUpdate() {
        this.activatedRoute.queryParams.subscribe((param) => {
            if (Object.keys(param).length > 0) {
                this.isUpdate = true;
                this.userForm.controls.login.disable();
                this.getIdFromRouteParamsAndSetDetail(param);
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
                .subscribe((blob) => {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        this.userImageSrc = reader.result;
                    };
                    reader.readAsDataURL(blob);
                }, () => {
                    this.notificationService.openErrorNotification('error.imageDownload');
                });
        }
        this.userGroups = user.groupIdList ? user.groupIdList : [];
    }

    private getIdFromRouteParamsAndSetDetail(param: any): void {
        this.userDataService.getUserDetail(param.id)
            .subscribe((apiUser) => {
                this.setForm(apiUser);
            }, (error) => this.notificationService.openErrorNotification(error));
    }

    private createForm(): void {
        this.userForm = this.formBuilder.group({
            id: [''],
            isVisible: [''],
            firstName: [''],
            lastName: [''],
            email: [''],
            login: [''],
            password: [
                '',
                Validators.compose([
                    Validators.pattern(this.userPasswordPattern),
                    Validators.maxLength(50)
                ])
            ],
            type: [''],
            state: [''],
            groupIdList: [''],
            projectIdList: [''],
        });
        this.userForm.controls.id.disable();
        this.userForm.valueChanges.subscribe(() => {
            this.emitFormDataChangeEmitter();
        });
    }

    private emitFormDataChangeEmitter(): void {
        if (this.userForm.invalid) {
            this.onFormDataChange.emit(null);
        } else {
            const actualValue = {
                ...this.userForm.value,
            };
            this.onFormDataChange.emit(actualValue);
        }
    }

    private initializeGroups(): void {
        this.groupService.browseGroups()
            .subscribe((groups) => {
                this.groupList = groups.content;
            });
    }

    private initializeProjects(): void {
        this.dashboardService.filterProjects('ALL')
            .subscribe((data: ProjectInterface[]) => {
                this.projectList = data;
            });
    }

}
