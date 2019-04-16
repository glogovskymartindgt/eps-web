import { Venue } from '../interfaces/venue.interface';

export class Project {
    public id?: number;
    public name?: string;
    public logo?: string;
    public state?: string;
    public year?: string;
    public venues?: Venue[];
}
