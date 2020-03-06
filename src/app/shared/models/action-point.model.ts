import { Responsible } from './responsible.model';

export interface ActionPoint {
    id?: number;
    code?: string;
    title?: string;
    trafficLight: string;
    cityName?: string;
    dueDate?: string;
    closedDate?: string;
    state?: string;
    responsibleUsers?: Responsible[];
    changedBy: {firstName: string, lastName: string};
    changedAt: string;
    createdBy: {firstName: string, lastName: string};
}
