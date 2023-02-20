export interface Attachment {
    id: number;
    type: string;
    format: string;
    fileName: string;
    filePath: string;
    order: number;
    fkActionPoint: number;
}
