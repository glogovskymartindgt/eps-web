import { Venue } from '../interfaces/venue.interface';

export class Project {
    id?: number;
    name?: string;
    logo?: string;
    country_1?: string;
    country_2?: string;
    venue_city_1?: string;
    venue_city_2?: string;
    state?: string;
    cities?: string[] = [];
    countries?: string[] = [];
    year?: string;
    venues?: Venue[];
}

