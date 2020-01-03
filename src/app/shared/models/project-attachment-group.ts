import { AttachmentDetail } from './attachment-detail.model';

export class ProjectAttachmentGroup {
    public maps: AttachmentDetail[];
    public images: AttachmentDetail[];
    public documents: AttachmentDetail[];

    public constructor() {
        this.maps = [];
        this.images = [];
        this.documents = [];
    }

}
