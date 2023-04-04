import { Injectable } from '@angular/core';
import { AttachmentDetail } from '../../../shared/models/attachment-detail.model';
import { ProjectAttachmentGroup } from '../../../shared/models/project-attachment-group';
import { ProjectVenueFileGroup } from '../../../shared/models/project-venue-file-group';
import { BlobManager } from '../../../shared/utils/blob-manager';

@Injectable({
    providedIn: 'root'
})
export class ProjectAttachmentService {

    public files = new ProjectVenueFileGroup();
    private readonly pdfBlobType = 'application/pdf';

    public constructor() {
    }

    public empty(): void {
        this.files = new ProjectVenueFileGroup();
    }

    public emptyFirstVenueFiles(): void {
        this.files.firstVenueAttachments = new ProjectAttachmentGroup();
    }

    public emptySecondVenueFiles(): void {
        this.files.secondVenueAttachments = new ProjectAttachmentGroup();
    }

    public emptyThirdVenueFiles(): void {
        this.files.thirdVenueAttachments = new ProjectAttachmentGroup();
    }

    public firstVenueAnyFile(): boolean {
        return this.anyValue(this.files.firstVenueAttachments.maps) ||
            this.anyValue(this.files.firstVenueAttachments.images) ||
            this.anyValue(this.files.firstVenueAttachments.documents);
    }

    public firstVenueAnyMaps(): boolean {
        return this.anyValue(this.files.firstVenueAttachments.maps);
    }

    public firstVenueAnyImages(): boolean {
        return this.anyValue(this.files.firstVenueAttachments.images);
    }

    public firstVenueAnyDocuments(): boolean {
        return this.anyValue(this.files.firstVenueAttachments.documents);
    }

    public secondVenueAnyFile(): boolean {
        return this.anyValue(this.files.secondVenueAttachments.maps) ||
            this.anyValue(this.files.secondVenueAttachments.images) ||
            this.anyValue(this.files.secondVenueAttachments.documents);
    }

    public secondVenueAnyMaps(): boolean {
        return this.anyValue(this.files.secondVenueAttachments.maps);
    }

    public secondVenueAnyImages(): boolean {
        return this.anyValue(this.files.secondVenueAttachments.images);
    }

    public secondVenueAnyDocuments(): boolean {
        return this.anyValue(this.files.secondVenueAttachments.documents);
    }

    public thirdVenueAnyFile(): boolean {
        return this.anyValue(this.files.thirdVenueAttachments.maps) ||
            this.anyValue(this.files.thirdVenueAttachments.images) ||
            this.anyValue(this.files.thirdVenueAttachments.documents);
    }

    public thirdVenueAnyMaps(): boolean {
        return this.anyValue(this.files.thirdVenueAttachments.maps);
    }

    public thirdVenueAnyImages(): boolean {
        return this.anyValue(this.files.thirdVenueAttachments.images);
    }

    public thirdVenueAnyDocuments(): boolean {
        return this.anyValue(this.files.thirdVenueAttachments.documents);
    }

    public addFirstVenueMap(attachmentDetail: AttachmentDetail): void {
        this.files.firstVenueAttachments.maps.unshift(attachmentDetail);
    }

    public addFirstVenueImage(attachmentDetail: AttachmentDetail): void {
        this.files.firstVenueAttachments.images.unshift(attachmentDetail);
    }

    public addFirstVenueDocument(attachmentDetail: AttachmentDetail): void {
        this.files.firstVenueAttachments.documents.unshift(attachmentDetail);
    }

    public addSecondVenueMap(attachmentDetail: AttachmentDetail): void {
        this.files.secondVenueAttachments.maps.unshift(attachmentDetail);
    }

    public addSecondVenueImage(attachmentDetail: AttachmentDetail): void {
        this.files.secondVenueAttachments.images.unshift(attachmentDetail);
    }

    public addSecondVenueDocument(attachmentDetail: AttachmentDetail): void {
        this.files.secondVenueAttachments.documents.unshift(attachmentDetail);
    }

    public addThirdVenueMap(attachmentDetail: AttachmentDetail): void {
        this.files.thirdVenueAttachments.maps.unshift(attachmentDetail);
    }

    public addThirdVenueImage(attachmentDetail: AttachmentDetail): void {
        this.files.thirdVenueAttachments.images.unshift(attachmentDetail);
    }

    public addThirdVenueDocument(attachmentDetail: AttachmentDetail): void {
        this.files.thirdVenueAttachments.documents.unshift(attachmentDetail);
    }

    public resetFirstVenueMap(index: number): void {
        this.files.firstVenueAttachments.maps.splice(index, 1);
    }

    public resetFirstVenueImage(index: number): void {
        this.files.firstVenueAttachments.images.splice(index, 1);
    }

    public resetFirstVenueDocument(index: number): void {
        this.files.firstVenueAttachments.documents.splice(index, 1);
    }

    public resetSecondVenueMap(index: number): void {
        this.files.secondVenueAttachments.maps.splice(index, 1);
    }

    public resetSecondVenueImage(index: number): void {
        this.files.secondVenueAttachments.images.splice(index, 1);
    }

    public resetSecondVenueDocument(index: number): void {
        this.files.secondVenueAttachments.documents.splice(index, 1);
    }

    public resetThirdVenueMap(index: number): void {
        this.files.thirdVenueAttachments.maps.splice(index, 1);
    }

    public resetThirdVenueImage(index: number): void {
        this.files.thirdVenueAttachments.images.splice(index, 1);
    }

    public resetThirdVenueDocument(index: number): void {
        this.files.thirdVenueAttachments.documents.splice(index, 1);
    }

    public orderAttachments(): void {
        this.files.firstVenueAttachments.maps.sort(this.sortByOrder);
        this.files.firstVenueAttachments.images.sort(this.sortByOrder);
        this.files.firstVenueAttachments.documents.sort(this.sortByOrder);
        this.files.secondVenueAttachments.maps.sort(this.sortByOrder);
        this.files.secondVenueAttachments.images.sort(this.sortByOrder);
        this.files.secondVenueAttachments.documents.sort(this.sortByOrder);
        this.files.thirdVenueAttachments.maps.sort(this.sortByOrder);
        this.files.thirdVenueAttachments.images.sort(this.sortByOrder);
        this.files.thirdVenueAttachments.documents.sort(this.sortByOrder);
    }

    public isJpegJpgOrPdfFromName(name: string): boolean {
        return [
            'jpg',
            'jpeg',
            'pdf'
        ].includes(this.getFileEnding(name));
    }

    public getFileEnding(filePath: string): string | undefined {
        if (!filePath) {
            return;
        }

        return filePath.substr(filePath.lastIndexOf('.') + 1)
                       .toLowerCase();
    }

    public getContentTypeFromFileName(fileName: string): string {
        const fileTypeMapper = [
            {
                fileType: 'pdf',
                blobType: this.pdfBlobType,
            },
            {
                fileType: 'jpeg',
                blobType: 'image/jpeg',
            },
            {
                fileType: 'txt',
                blobType: 'text/plain',
            },
            {
                fileType: 'rtf',
                blobType: '.rtf',
            },
            {
                fileType: 'csv',
                blobType: '.csv',
            },
            {
                fileType: 'doc',
                blobType: '.doc',
            },
            {
                fileType: 'docx',
                blobType: '.docx',
            },
            {
                fileType: 'xls',
                blobType: '.application/vnd.ms-excel',
            },
            {
                fileType: 'xlsx',
                blobType: '.application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            },
            {
                fileType: 'zip',
                blobType: '.zip',
            },
        ];

        return fileTypeMapper.find((type: any): any => type.fileType === this.getFileEnding(fileName)).blobType;
    }

    public downloadFromBlob = (attachmentDetail: AttachmentDetail): void => {
        BlobManager.downloadFromBlob(attachmentDetail.blob, this.pdfBlobType, attachmentDetail.fileName);
    }

    private anyValue(array: any[]): boolean {
        return array.length > 0;
    }

    private readonly sortByOrder = (comparator: AttachmentDetail, comparable: AttachmentDetail): number => {
        if (comparator.order > comparable.order) {
            return 1;
        }
        if (comparator.order < comparable.order) {
            return -1;
        }

        return 0;
    }
}
