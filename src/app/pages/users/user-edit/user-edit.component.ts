import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Role } from '../../../shared/enums/role.enum';
import { UserDataService } from '../../../shared/services/data/user-data.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { UserFormComponent } from '../user-form/user-form.component';
import { UserEditBaseComponent } from './user-edit-base.component';

@Component({
    selector: 'iihf-user-edit',
    templateUrl: './user-edit.component.html',
    styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent extends UserEditBaseComponent implements OnInit {

    @ViewChild(UserFormComponent, {static: true}) public userForm: UserFormComponent;
    public userRoles: typeof Role = Role;

    private userId;

    public constructor(
        protected readonly router: Router,
        private readonly userDataService: UserDataService,
        private readonly notificationService: NotificationService,
        private readonly activatedRoute: ActivatedRoute,
    ) {
        super(router);
    }

    public ngOnInit(): void {
        this.activatedRoute.queryParams.subscribe((param: Params): void => {
            this.userId = param.id;
        });
    }

    public onSave(): void {
        this.transformUserToApiObject();
        if (this.formData) {
            this.userDataService.updateUser(this.userId, this.transformUserToApiObject())
                .subscribe((): void => {
                    this.notificationService.openSuccessNotification('success.edit');
                    this.router.navigate(['users/list']);
                }, (error: any): void => {
                    this.notificationService.openErrorNotification(this.getTranslationFromErrorCode(error.error.code));
                });
        }
    }

    public formDataChange($event): void {
        const formChangeTimeout = 200;
        setTimeout((): void => {
            this.formData = $event;
        }, formChangeTimeout);
    }

    protected adjustDifferingApiFields(apiObject: any): any {
        const apiObjectCopy: any = {...apiObject};

        apiObjectCopy.isVisible = this.formData.isVisible;
        if (this.formData.password) {
            apiObjectCopy.password = this.formData.password;
        }
        if (this.formData.state !== null) {
            apiObjectCopy.state = this.formData.state ? 'ACTIVE' : 'INACTIVE';
        }

        return apiObjectCopy;
    }
}
