import { VenueDetail } from './venue-detail.model';

export class ProjectDetail {
    public id: number;
    public name: string;
    public year: string;
    public state: string;
    public logo?: string;
    public dateFrom?: string;
    public dateTo?: string;
    public projectVenue?: VenueDetail[];
    public description: string;
}
