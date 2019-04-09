import { ClBusinessArea } from './cl-business-area.interface';
import { ClSourceOfAgenda } from './cl-source-of-agenda.interface';
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
    clSourceOfAgenda?: ClSourceOfAgenda;
    clBusinessArea?: ClBusinessArea;
}
