import { Injectable } from '@angular/core';
import { TableChangeEvent } from '../hazlenut/core-table';

@Injectable({
    providedIn: 'root'
})
export class TableChangeStorageService {

    private tasksLastTableChangeEvent: TableChangeEvent;
    private factsLastTableChangeEvent: TableChangeEvent;

    public constructor() {
    }

    public setTasksLastTableChangeEvent(changeEvent?: TableChangeEvent) {
        this.tasksLastTableChangeEvent = {...changeEvent, filters: [...changeEvent.filters]};
    }

    public setFactsLastTableChangeEvent(changeEvent?: TableChangeEvent) {
        this.factsLastTableChangeEvent = {...changeEvent, filters: [...changeEvent.filters]};
    }

    public getTasksLastTableChangeEvent() {
        return this.tasksLastTableChangeEvent;
    }

    public getFactsLastTableChangeEvent() {
        return this.factsLastTableChangeEvent;
    }

}
