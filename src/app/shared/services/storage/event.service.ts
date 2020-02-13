import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ABSTRACT_STORAGE_TOKEN, AbstractStorageService } from '../../hazelnut/hazelnut-common/services';

type Proxify<T> = {
    [S in keyof T]: Observable<T[S]>;
};

@Injectable({
    providedIn: 'root'
})
export class EventService<T extends object> {
    private readonly _behaviorSubject: BehaviorSubject<T>;
    private readonly _instant: T;
    private readonly _subject: Proxify<T>;

    protected constructor(@Inject(ABSTRACT_STORAGE_TOKEN) private readonly storageService: AbstractStorageService) {
        const value = (this.loadData() || {}) as T;
        this._instant = new Proxy<any>(value, {
            get: (target: any, name: keyof T): any => {
                return this._behaviorSubject.value[name];
            },
            set(): any {
                throw new Error('Cannot set value directly');
            }
        });
        this._subject = new Proxy<any>(value, {
            get: (target: any, name: keyof T): any => {
                return this._behaviorSubject.pipe(map((item: T) => item[name]));
            },
            set(): any {
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
        this.storageService.removeItem('projectData');
    }

    private loadData(): T {
        return this.storageService.getObjectItem('projectData') as T;
    }

    private storeData(data: T): void {
        this.storageService.setItemValue('projectData', data);
    }
}
