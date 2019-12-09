import { Responsible } from './responsible.model';

export interface ActionPoint {
    id?: number;
    code?: string;
    title?: string;
    cityName?: string;
    dueDate?: string;
    closedDate?: string;
    state?: string;
    responsibleUsers?: Responsible[];
}
