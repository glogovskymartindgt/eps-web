import { Venue } from '../interfaces/venue.interface';

export class Project {
    public id?: number;
    public name?: string;
    public logo?: string;
    public firstCountry?: string;
    public secondCountry?: string;
    public fisrtVenue?: string;
    public secondVenue?: string;
    public state?: string;
    public cities?: string[] = [];
    public countries?: string[] = [];
    public year?: string;
    public venues?: Venue[];
}
