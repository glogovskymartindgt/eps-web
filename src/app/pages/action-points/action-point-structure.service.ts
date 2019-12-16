import { Injectable } from '@angular/core';
import { Responsible } from '../../shared/models/responsible.model';

@Injectable({
    providedIn: 'root'
})
export class ActionPointStructureService {

    public constructor() {
    }

    public addOptionalAttributesToApiObject(apiObject: any, formObject: any): any {
        const extendedObject = apiObject;
        if (formObject.actionPointText !== '') {
            extendedObject.actionPointText = formObject.actionPointText;
        }
        if (formObject.dueDate !== null) {
            extendedObject.dueDate = formObject.dueDate;
        }
        if (formObject.area !== '') {
            extendedObject.area = formObject.area;
        }
        if (formObject.meetingDate !== null) {
            extendedObject.meetingDate = formObject.meetingDate;
        }
        if (formObject.meetingText !== '') {
            extendedObject.meetingDescription = formObject.meetingText;
        }
        if (formObject.venue !== '') {
            extendedObject.cityName = formObject.venue;
        }
        if (formObject.description !== '') {
            extendedObject.description = formObject.description;
        }
        if (formObject.responsibleUsers && formObject.responsibleUsers.length > 0) {
            extendedObject.responsibles = formObject.responsibleUsers.map((responsible: Responsible) => responsible.id);
        }

        return extendedObject;
    }
}
