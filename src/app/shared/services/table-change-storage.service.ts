import { Injectable } from '@angular/core';
import { TableChangeEvent, TableConfiguration } from '../hazelnut/core-table';
import { StringUtils } from '../hazelnut/hazelnut-common/hazelnut';
import { Filter } from '../hazelnut/hazelnut-common/models';

@Injectable({
    providedIn: 'root'
})

/**
 * Store table change events
 */ export class TableChangeStorageService {
    private tasksLastTableChangeEvent: any;
    private factsLastTableChangeEvent: TableChangeEvent;
    private usersLastTableChangeEvent: TableChangeEvent;

    private _isReturnFromDetail = false;
    private _cachedTableChangeEvent: TableChangeEvent;

    public constructor() {
    }

    /**
     * Determine, whether to use the cached tableChangeEvent
     * @param isReturnFromDetail
     */
    public set isReturnFromDetail(isReturnFromDetail: boolean) {
        this._isReturnFromDetail = isReturnFromDetail;
    }

    /**
     * Store table change event
     * @param changeEvent
     */
    public set cachedTableChangeEvent(changeEvent: TableChangeEvent) {
        this._cachedTableChangeEvent = {
            ...changeEvent,
            filters: [...changeEvent.filters]
        };
    }

    /**
     * Storing data from task list and also additional filters, because we need business area filter which is not in
     * table
     * @param changeEvent
     * @param additionalFilers
     */
    public setTasksLastTableChangeEvent(changeEvent: TableChangeEvent, additionalFilers: Filter[]): void {
        this.tasksLastTableChangeEvent = {
            ...changeEvent,
            filters: [...changeEvent.filters],
            additionalFilters: additionalFilers
        };
    }

    /**
     * Store table change event in facts
     * @param changeEvent
     */
    public setFactsLastTableChangeEvent(changeEvent?: TableChangeEvent): void {
        this.factsLastTableChangeEvent = {
            ...changeEvent,
            filters: [...changeEvent.filters]
        };
    }

    public setUsersLastTableChangeEvent(changeEvent?: TableChangeEvent): void {
        this.usersLastTableChangeEvent = {
            ...changeEvent,
            filters: [...changeEvent.filters]
        };
    }

    /**
     * Get stored tasks table change event
     */
    public getTasksLastTableChangeEvent(): any {
        return this.tasksLastTableChangeEvent;
    }

    /**
     * Get stored facts table change event
     */
    public getFactsLastTableChangeEvent(): TableChangeEvent {
        return this.factsLastTableChangeEvent;
    }

    public getUsersLastTableChangeEvent(): TableChangeEvent {
        return this.usersLastTableChangeEvent;
    }

    /**
     * Update a table configuration, from the last cached API request (tableChangeEvent)
     * @param configuration - configuration to update
     */
    public updateTableConfiguration(
        configuration: TableConfiguration
    ): TableConfiguration {
        const updatedConfiguration: TableConfiguration = { ...configuration };
        if (!this._cachedTableChangeEvent || !this._isReturnFromDetail) {
            return updatedConfiguration;
        }

        if (this._cachedTableChangeEvent.filters) {
            configuration.predefinedFilters = this._cachedTableChangeEvent.filters;
        }
        if (this._cachedTableChangeEvent.pageIndex) {
            configuration.predefinedPageIndex = this._cachedTableChangeEvent.pageIndex;
        }
        if (this._cachedTableChangeEvent.pageSize) {
            configuration.predefinedPageSize = this._cachedTableChangeEvent.pageSize;
        }
        if (this._cachedTableChangeEvent.sortDirection) {
            configuration.predefinedSortDirection = this._cachedTableChangeEvent.sortDirection.toLowerCase();
        }
        if (this._cachedTableChangeEvent.sortActive) {
            configuration.predefinedSortActive = StringUtils.convertSnakeToCamel(this._cachedTableChangeEvent.sortActive.toLowerCase());
        }

        return updatedConfiguration;
    }

}
