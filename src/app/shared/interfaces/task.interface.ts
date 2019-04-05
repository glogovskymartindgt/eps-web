import { Phase } from './phase.interface';
import { User } from './user.interface';

export interface TaskInterface {
    id?: number;
    trafficLight?: string;
    code?: string;
    name?: string;
    projectPhase?: Phase;
    cityName?: string;
    responsibleUser?: User;
    dueDate?: string;
    state?: string;
}
