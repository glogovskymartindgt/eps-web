import { Inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ABSTRACT_STORAGE_TOKEN, AbstractStorageService } from './abstract-storage.service';
import { isNullOrUndefined } from 'util';

type Proxify<T> = {
    [P in keyof T]: Observable<T[P]>;
};

export abstract class UserService<T extends object> {
    private readonly _behaviorSubject: BehaviorSubject<T>;
    private readonly _instant: T;
    private readonly _subject: Proxify<T>;

    public login: string;

    protected constructor(@Inject(ABSTRACT_STORAGE_TOKEN) private readonly storageService: AbstractStorageService) {
        const value = (this.loadData() || {}) as T;
        this._instant = new Proxy<any>(value, {
            get: (target, name: keyof T) => {
                return this._behaviorSubject.value[name];
            },
            set() {
                throw new Error('Cannot set value directly');
            }
        });
        this._subject = new Proxy<any>(value, {
            get: (target, name: keyof T) => {
                return this._behaviorSubject.pipe(map((item) => item[name]));
            },
            set() {
                throw new Error('Cannot set value directly');
            }
        });
        this._behaviorSubject = new BehaviorSubject<T>(value);
    }

    public get instant(): T {
        return this._instant;
    }

    public get subject(): Proxify<T> {
        return this._subject;
    }

    public setProperty(key: keyof T, value: any): T {
        const newValue: T = {...this._behaviorSubject.value as any};
        newValue[key] = value;
        this._behaviorSubject.next(newValue);
        return newValue;
    }

    public setData(data: T): T {
        this._behaviorSubject.next(data);
        this.storeData(data);
        return data;
    }

    public clearUserData(): void {
        this.storageService.removeItem(this.login);
        this.storageService.removeItem('lastUser');
        this._behaviorSubject.next({} as T);
    }

    /*
     * when user refreshes the page, 'lastUser' is used
     */
    private loadData(): T {
        if ((!isNullOrUndefined(localStorage.getItem('lastUser')))) {
            this.login = localStorage.getItem('lastUser');
        }
        return this.storageService.getObjectItem(this.login) as T;
    }

    private storeData(data: any): void {
        this.login = data.login;
        this.storageService.setItemValue(data.login, data);
    }

}
