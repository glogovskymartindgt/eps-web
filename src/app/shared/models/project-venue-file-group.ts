import { ProjectAttachmentGroup } from './project-attachment-group';

export class ProjectVenueFileGroup {
    public firstVenueAttachments: ProjectAttachmentGroup;
    public secondVenueAttachments: ProjectAttachmentGroup;
    public thirdVenueAttachments: ProjectAttachmentGroup;

    public constructor() {
        this.firstVenueAttachments = new ProjectAttachmentGroup();
        this.secondVenueAttachments = new ProjectAttachmentGroup();
        this.thirdVenueAttachments = new ProjectAttachmentGroup();
    }
}
