import { AttachmentDetail } from '../models/attachment-detail.model';
import { ClBusinessArea } from './cl-business-area.interface';

export interface Guideline {
    id: number;
    attachment: AttachmentDetail;
    clBusinessArea: ClBusinessArea;
    description: string;
    projectId: number;
    title: string;

    created: Date | number;
    createdBy: {id: number, firstName: string, lastName: string};
    updated: Date | number;
    updatedBy: {id: number, firstName: string, lastName: string};
}
