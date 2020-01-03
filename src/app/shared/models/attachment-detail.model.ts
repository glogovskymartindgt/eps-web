import { AttachmentFormat } from '../enums/attachment-format.enum';
import { AttachmentType } from '../enums/attachment-type.enum';

export class AttachmentDetail {
    public format: AttachmentFormat;
    public type: AttachmentType;
    public fileName: string;
    public filePath: string;
    public id?: number;
    public order?: number;
    public source?: any;
    public blob?: Blob;

    public constructor(fileName: string, filePath: string, source: any, blob: Blob, order: number) {
        this.fileName = fileName;
        this.filePath = filePath;
        this.source = source;
        this.blob = blob;
        this.order = order;
    }
}
