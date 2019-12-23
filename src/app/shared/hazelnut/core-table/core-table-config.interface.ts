import { InjectionToken } from '@angular/core';

export interface CoreTableConfigInterface {
    paging?: boolean;

    pageSize?: number;

    pageSizeOptions?: number[];

    uppercaseHeader?: boolean;

    noDataText?: string;

    columnBorders?: boolean;

    trClasses?: string;

    filterDebounceTime?: number;
}

export const GLOBAL_CONFIG_TOKEN = new InjectionToken<CoreTableConfigInterface>('CoreTableConfiguration');
