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
        console.log('set', changeEvent);
        this.tasksLastTableChangeEvent = changeEvent;
        console.log('ex', this.tasksLastTableChangeEvent);
    }

    public setFactsLastTableChangeEvent(changeEvent?: TableChangeEvent) {
        this.factsLastTableChangeEvent = changeEvent;
    }

    public getTasksLastTableChangeEvent() {
        return this.tasksLastTableChangeEvent;
    }

    public getFactsLastTableChangeEvent() {
        return this.factsLastTableChangeEvent;
    }

}
