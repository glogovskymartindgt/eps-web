import { Component, Input, OnInit } from '@angular/core';
import { AttachmentType } from '../../../shared/enums/attachment-type.enum';

@Component({
    selector: 'iihf-project-file-placeholder',
    templateUrl: './project-file-placeholder.component.html',
    styleUrls: ['./project-file-placeholder.component.scss']
})
export class ProjectFilePlaceholderComponent implements OnInit {
    @Input() public attachmentType: AttachmentType;
    @Input() public venue: string;
    public placeholderImageSrc;
    public alt;
    public ending;

    public constructor() {
    }

    public ngOnInit(): void {
        this.initializeValuesByType();
    }

    private initializeValuesByType() {
        if (this.attachmentType === AttachmentType.Map) {
            this.placeholderImageSrc = 'assets/img/custom-svg/stadium.svg';
            this.alt = 'map';
            this.ending = 'project.noMapsAdded';
        } else if (this.attachmentType === AttachmentType.Image) {
            this.placeholderImageSrc = 'assets/img/custom-svg/image.svg';
            this.alt = 'image';
            this.ending = 'project.noImagesAdded';
        } else if (this.attachmentType === AttachmentType.Document) {
            this.placeholderImageSrc = 'assets/img/custom-svg/document.svg';
            this.alt = 'document';
            this.ending = 'project.noDocumentsAdded';
        }
    }

}
