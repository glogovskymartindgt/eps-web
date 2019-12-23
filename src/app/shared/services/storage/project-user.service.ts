import { Injectable } from '@angular/core';
import { AbstractStorageService, UserService } from '../../hazelnut/hazelnut-common/services';
import { UserDataInterface } from '../../interfaces/user-data.interface';

@Injectable({
    providedIn: 'root'
})
export class ProjectUserService extends UserService<UserDataInterface> {
    public constructor(storageService: AbstractStorageService) {
        super(storageService);
    }

    public get isLoggedIn(): boolean {
        return Boolean(this.instant && this.instant.authToken);
    }

    public setAuthData(data: any): void {
        this.setData({
            id: data.accountData.id,
            login: data.accountData.login,
            email: data.accountData.email,
            roles: data.accountData.roles,
            masterToken: data.masterTokenData.generatedToken,
            authToken: data.authenticationTokenData.generatedToken,
            userId: data.accountData.user.id,
            deviceId: 'device1',
        });
    }

    public setProperty(key: keyof UserDataInterface, value: any): UserDataInterface {
        return super.setProperty(key, value);
    }

}
