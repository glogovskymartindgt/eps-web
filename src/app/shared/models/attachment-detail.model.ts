import { AttachmentFormat } from '../enums/attachment-format.enum';
import { AttachmentType } from '../enums/attachment-type.enum';

export class AttachmentDetail {
    public format: AttachmentFormat;
    public type: AttachmentType;
    public fileName: string;
    public filePath: string;
    public id?: number;
}
