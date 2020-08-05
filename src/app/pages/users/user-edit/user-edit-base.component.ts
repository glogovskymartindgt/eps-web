import { Router } from '@angular/router';
import { UserFormControlNames } from '../user-form/user-form-control-names.enum';

export abstract class UserEditBaseComponent {
    public formData = null;

    protected constructor(
        protected readonly router: Router,
    ) {
    }

    public onCancel(): void {
        this.router.navigate(['users', 'list']);
    }

    protected transformUserToApiObject(): {} {
        let apiObject: any = {
            [UserFormControlNames.firstName]: this.formData[UserFormControlNames.firstName],
            [UserFormControlNames.lastName]: this.formData[UserFormControlNames.lastName],
            [UserFormControlNames.type]: this.formData[UserFormControlNames.type],

            [UserFormControlNames.mobile]: this.formData[UserFormControlNames.mobile],
            [UserFormControlNames.phone]: this.formData[UserFormControlNames.phone],
            [UserFormControlNames.organization]: this.formData[UserFormControlNames.organization],
            [UserFormControlNames.function]: this.formData[UserFormControlNames.function],
        };

        apiObject = this.adjustDifferingApiFields(apiObject);

        if (this.formData[UserFormControlNames.email]) {
            apiObject[UserFormControlNames.email] = this.formData[UserFormControlNames.email];
        }
        if (this.formData[UserFormControlNames.avatar]) {
            apiObject[UserFormControlNames.avatar] = this.formData[UserFormControlNames.avatar];
        }
        if (this.formData[UserFormControlNames.projectIdList] && this.formData[UserFormControlNames.projectIdList].length > 0) {
            apiObject[UserFormControlNames.projectIdList] = this.formData[UserFormControlNames.projectIdList];
        }
        if (this.formData[UserFormControlNames.groupIdList] && this.formData[UserFormControlNames.groupIdList].length > 0) {
            apiObject[UserFormControlNames.groupIdList] = this.formData[UserFormControlNames.groupIdList];
        }

        return apiObject;
    }

    protected abstract adjustDifferingApiFields(apiObject: any): any;

    protected getTranslationFromErrorCode(code: string): string {
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
            case '36':
                return 'error.telephone.format.error';
            default:
                return 'user.error.add';
        }
    }
}
