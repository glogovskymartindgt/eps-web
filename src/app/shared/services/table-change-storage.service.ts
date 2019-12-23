import { Injectable } from '@angular/core';
import { TableChangeEvent } from '../hazelnut/core-table';
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

    public constructor() {
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

}
