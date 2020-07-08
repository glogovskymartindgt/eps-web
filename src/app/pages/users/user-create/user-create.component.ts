import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UserDataService } from '../../../shared/services/data/user-data.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { UserEditBaseComponent } from '../user-edit/user-edit-base.component';
import { UserFormComponent } from '../user-form/user-form.component';

@Component({
    selector: 'iihf-user-create',
    templateUrl: './user-create.component.html',
    styleUrls: ['./user-create.component.scss']
})
export class UserCreateComponent extends UserEditBaseComponent {
    @ViewChild(UserFormComponent, {static: true}) public taskForm: UserFormComponent;
    public formData = null;
    public loading: false;

    public constructor(
        protected readonly router: Router,
        private readonly notificationService: NotificationService,
        private readonly userDataService: UserDataService,
    ) {
        super(router);
    }

    public onSave(): void {
        this.userDataService.createUser(this.transformUserToApiObject())
            .subscribe((): void => {
                this.notificationService.openSuccessNotification('success.add');
                this.router.navigate(['users/list']);
            }, (error: any): void => {
                this.notificationService.openErrorNotification(this.getTranslationFromErrorCode(error.error.code));
            });
    }

    protected adjustDifferingApiFields(apiObject: any): any {
        const apiObjectCopy: any = {...apiObject};

        apiObjectCopy.login = this.formData.login.toLowerCase();
        apiObjectCopy.password = this.formData.password;

        return apiObjectCopy;
    }
}
