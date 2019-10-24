import { AttachmentDetail } from './attachment-detail.model';

export class Profile {
    public id: number;
    public firstName: string;
    public lastName: string;
    public email: string;
    public login: string;
    public password: string;
    public active: boolean;
    public attachment: AttachmentDetail;
}
