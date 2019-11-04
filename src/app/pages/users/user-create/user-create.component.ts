import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UserDataService } from '../../../shared/services/data/user-data.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { TaskFormComponent } from '../../tasks/task-form/task-form.component';

@Component({
    selector: 'user-create',
    templateUrl: './user-create.component.html',
    styleUrls: ['./user-create.component.scss']
})
export class UserCreateComponent implements OnInit {
    @ViewChild(TaskFormComponent, {static: true}) public taskForm: TaskFormComponent;
    public formData = null;
    public loading: false;

    public constructor(private readonly router: Router, private readonly notificationService: NotificationService, private readonly userDataService: UserDataService) {
    }

    public ngOnInit(): void {
    }

    public onCancel(): void {
        this.router.navigate(['users/list']);
    }

    public onSave(): void {
        this.userDataService.createUser(this.transformUserToApiObject())
            .subscribe(() => {
                this.notificationService.openSuccessNotification('success.add');
                this.router.navigate(['users/list']);
            }, (e) => {
                console.log('error', this.getTranslationFromErrorCode(e.error.code));
                this.notificationService.openErrorNotification(this.getTranslationFromErrorCode(e.error.code));
            });
    }

    private transformUserToApiObject() {
        const apiObject: any = {
            firstName: this.formData.firstName,
            lastName: this.formData.lastName,
            type: this.formData.type,
            login: this.formData.login,
            password: this.formData.password,
        };
        if (this.formData.email) {
            apiObject.email = this.formData.email;
        }
        if (this.formData.projectIdList && this.formData.projectIdList.length > 0) {
            apiObject.projectIdList = this.formData.projectIdList;
        }
        if (this.formData.groupIdList && this.formData.groupIdList.length > 0) {
            apiObject.groupIdList = this.formData.groupIdList;
        }
        return apiObject;
    }

    private getTranslationFromErrorCode(code: string): string {
        console.log('code', code);
        switch (code) {
            case '10002':
                return 'user.error.loginUsed';
            case '20':
                return 'user.error.unsupportedType';
            case '21':
                return 'user.error.requireProject';
            case '22':
                return 'user.error.typeCannotBeNull';
            case '23':
                return 'user.error.requestCannotBeNull';
            default:
                return 'user.error.add';
        }
    }

}
