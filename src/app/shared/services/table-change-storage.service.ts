import { Injectable } from '@angular/core';
import { TableChangeEvent, TableColumn, TableConfiguration } from '../hazelnut/core-table';
import { StringUtils } from '../hazelnut/hazelnut-common/hazelnut';

@Injectable({
    providedIn: 'root'
})

/**
 * Store table change events
 */ export class TableChangeStorageService {
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

    public setUsersLastTableChangeEvent(changeEvent?: TableChangeEvent): void {
        this.usersLastTableChangeEvent = {
            ...changeEvent,
            filters: [...changeEvent.filters]
        };
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
            updatedConfiguration.predefinedFilters = this._cachedTableChangeEvent.filters;
        }
        if (this._cachedTableChangeEvent.pageIndex) {
            updatedConfiguration.predefinedPageIndex = this._cachedTableChangeEvent.pageIndex;
        }
        if (this._cachedTableChangeEvent.pageSize) {
            updatedConfiguration.predefinedPageSize = this._cachedTableChangeEvent.pageSize;
        }
        if (this._cachedTableChangeEvent.sortDirection) {
            updatedConfiguration.predefinedSortDirection = this._cachedTableChangeEvent.sortDirection.toLowerCase();
        }
        const sortActive: string = this._cachedTableChangeEvent.sortActive;
        if (sortActive) {
            const sortedColumn: TableColumn = configuration.columns.find((column: TableColumn): boolean =>
                [column.columnDef, column.columnRequestName].includes(StringUtils.convertSnakeToCamel(sortActive))
            );
            updatedConfiguration.predefinedSortActive = sortedColumn.columnDef;
        }

        return updatedConfiguration;
    }

}
