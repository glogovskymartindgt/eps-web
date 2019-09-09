import { AttachmentDetail } from './attachment-detail.model';
import { CountryDetail } from './country-detail.model';

export class VenueDetail {
    public id: number;
    public screenPosition: number;
    public cityName: string;
    public clCountry: CountryDetail;
    public attachment: AttachmentDetail;
}
