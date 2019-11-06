import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Role } from '../../../shared/enums/role.enum';
import { AuthService } from '../../../shared/services/auth.service';
import { UserDataService } from '../../../shared/services/data/user-data.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { UserFormComponent } from '../user-form/user-form.component';

@Component({
    selector: 'user-edit',
    templateUrl: './user-edit.component.html',
    styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit {

    @ViewChild(UserFormComponent, {static: true}) public userForm: UserFormComponent;
    public formData = null;
    private userId;

    public constructor(private readonly router: Router,
                       private readonly userDataService: UserDataService,
                       private readonly notificationService: NotificationService,
                       private readonly activatedRoute: ActivatedRoute,
                       private readonly authService: AuthService) {
    }

    public ngOnInit(): void {
        this.activatedRoute.queryParams.subscribe((param) => {
            this.userId = param.id;
        });
    }

    public onCancel() {
        this.router.navigate(['users/list']);
    }

    public onSave() {
        this.transformUserToApiObject();
        if (this.formData) {
            this.userDataService.updateUser(this.userId, this.transformUserToApiObject())
                .subscribe(() => {
                    this.notificationService.openSuccessNotification('success.edit');
                    this.router.navigate(['users/list']);
                }, () => {
                    // TODO add error states
                    this.notificationService.openErrorNotification('error.edit');
                });
        }
    }

    public formDataChange($event) {
        setTimeout(() => {
            this.formData = $event;
        }, 200);
    }

    public hasRoleUpdateUser(): boolean {
        return this.authService.hasRole(Role.RoleUpdateUser);
    }

    private transformUserToApiObject() {
        const apiObject: any = {
            firstName: this.formData.firstName,
            lastName: this.formData.lastName,
            isVisible: this.formData.isVisible,
            type: this.formData.type,
        };
        if (this.formData.password) {
            apiObject.password = this.formData.password;
        }
        if (this.formData.email) {
            apiObject.email = this.formData.email;
        }
        if (this.formData.projectIdList && this.formData.projectIdList.length > 0) {
            apiObject.projectIdList = this.formData.projectIdList;
        }
        if (this.formData.groupIdList && this.formData.groupIdList.length > 0) {
            apiObject.groupIdList = this.formData.groupIdList;
        }
        if (this.formData.state !== null) {
            apiObject.state = this.formData.state ? 'ACTIVE' : 'INACTIVE';
        }
        return apiObject;
    }

}
