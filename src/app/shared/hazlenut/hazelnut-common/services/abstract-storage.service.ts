import { Injectable, InjectionToken } from '@angular/core';

/**
 */

let actualStorage: Storage = sessionStorage; // localStorage

/**
 * Storage service
 */

@Injectable({
    providedIn: 'root'
})
export abstract class AbstractStorageService {
    /**
     * Method set actual storage
     */
    public static setStorage(newStorage: Storage): void {
        if (!newStorage) {
            throw new Error(`Cannot set ${newStorage} as storage`);
        }
        actualStorage = newStorage;
    }

    /**
     * Method store key value to actual storage
     *
     */
    public setItemValue(key: string, value: any): void {
        actualStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
    }

    /**
     * Method returns value from actual storage
     *
     * @returns value by key
     */

    public getItem(key: string): string | null {
        return actualStorage.getItem(key);
    }

    /**
     *
     */
    public getObjectItem(key: string): any {
        return JSON.parse(this.getItem(key));
    }

    /**
     *
     */
    public containsItem(key: string): boolean {
        return Boolean(this.getItem(key));
    }

    /**
     * Method remove key from actual storage
     *
     */
    public removeItem(key: string): void {
        actualStorage.removeItem(key);
    }
}

export const ABSTRACT_STORAGE_TOKEN = new InjectionToken<AbstractStorageService>('abstractStorageService');
