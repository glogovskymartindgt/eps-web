import { Injectable } from '@angular/core';
import { TableChangeEvent } from '../hazlenut/core-table';
import { Filter } from '../hazlenut/hazelnut-common/models';

@Injectable({
    providedIn: 'root'
})

/**
 * Store table change events
 */
export class TableChangeStorageService {
    private tasksLastTableChangeEvent: any;
    private factsLastTableChangeEvent: TableChangeEvent;

    public constructor() {
    }

    /**
     * Storing data from task list and also additional filters, because we need business area filter which is not in
     * table
     * @param changeEvent
     * @param additionalFilers
     */
    public setTasksLastTableChangeEvent(changeEvent: TableChangeEvent, additionalFilers: Filter[]) {
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
    public setFactsLastTableChangeEvent(changeEvent?: TableChangeEvent) {
        this.factsLastTableChangeEvent = {...changeEvent, filters: [...changeEvent.filters]};
    }

    /**
     * Get stored tasks table change event
     */
    public getTasksLastTableChangeEvent() {
        return this.tasksLastTableChangeEvent;
    }

    /**
     * Get stored facts table change event
     */
    public getFactsLastTableChangeEvent() {
        return this.factsLastTableChangeEvent;
    }

}
