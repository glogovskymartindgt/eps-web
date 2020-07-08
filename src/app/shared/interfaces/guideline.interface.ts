import { AttachmentDetail } from '../models/attachment-detail.model';
import { ClBusinessArea } from './cl-business-area.interface';

export interface Guideline {
    id: number;
    attachment: AttachmentDetail;
    clBusinessArea: ClBusinessArea;
    description: string;
    projectId: number;
    title: string;

    createdAt: Date | number;
    changedAt: Date | number;
    changedBy: any;
}
