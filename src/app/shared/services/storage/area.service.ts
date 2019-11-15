import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ABSTRACT_STORAGE_TOKEN, AbstractStorageService } from '../../hazlenut/hazelnut-common/services';

type Proxify<T> = {
    [P in keyof T]: Observable<T[P]>;
};

@Injectable({
    providedIn: 'root'
})
export class AreaService<T extends object> {
    private readonly _behaviorSubject: BehaviorSubject<T>;
    private readonly _instant: T;
    private readonly _subject: Proxify<T>;

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
        this.storageService.removeItem('areaData');
    }

    private loadData(): T {
        return this.storageService.getObjectItem('areaData') as T;
    }

    private storeData(data: T): void {
        this.storageService.setItemValue('areaData', data);
    }
}
