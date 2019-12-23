import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import * as _moment from 'moment';
import { Subject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { ImageDialogComponent } from '../../../shared/components/dialog/image-dialog/image-dialog.component';
import { PdfDialogComponent } from '../../../shared/components/dialog/pdf-dialog/pdf-dialog.component';
import { AttachmentType } from '../../../shared/enums/attachment-type.enum';
import { enterLeave, fadeEnterLeave } from '../../../shared/hazelnut/hazelnut-common/animations';
import { BrowseResponse } from '../../../shared/hazelnut/hazelnut-common/models';
import { Regex } from '../../../shared/hazelnut/hazelnut-common/regex/regex';
import { AttachmentDetail } from '../../../shared/models/attachment-detail.model';
import { Country } from '../../../shared/models/country.model';
import { ProjectDetail } from '../../../shared/models/project-detail.model';
import { VenueDetail } from '../../../shared/models/venue-detail.model';
import { AttachmentService } from '../../../shared/services/data/attachment.service';
import { BusinessAreaService } from '../../../shared/services/data/business-area.service';
import { ImagesService } from '../../../shared/services/data/images.service';
import { ProjectsService } from '../../../shared/services/data/projects.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { ProjectEventService } from '../../../shared/services/storage/project-event.service';
import { BlobManager } from '../../../shared/utils/blob-manager';

const moment = _moment;

export const PROJECT_DATE_FORMATS = {
    parse: {
        dateInput: 'D.M.YYYY',
    },
    display: {
        dateInput: 'D.M.YYYY',
        monthYearLabel: 'D.M.YYYY',
        dateA11yLabel: 'D.M.YYYY',
        monthYearA11yLabel: 'D.M.YYYY',
    },
};

/* tslint:disable */
@Component({
    selector: 'iihf-project-detail-form',
    templateUrl: './project-detail-form.component.html',
    styleUrls: ['./project-detail-form.component.scss'],
    animations: [
        enterLeave,
        fadeEnterLeave
    ],
    providers: [
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE]
        },
        {
            provide: MAT_DATE_FORMATS,
            useValue: PROJECT_DATE_FORMATS
        },
    ],
})
export class ProjectDetailFormComponent implements OnInit, OnChanges, OnDestroy {
    @Input() public editMode: boolean;
    @Input() public refreshSubject: Subject<any>;
    @Output() public readonly formDataChange = new EventEmitter<any>();
    @Output() public readonly firstVenueMapsChange = new EventEmitter<any>();
    @Output() public readonly secondVenueMapsChange = new EventEmitter<any>();
    @Output() public readonly firstVenueImagesChange = new EventEmitter<any>();
    @Output() public readonly secondVenueImagesChange = new EventEmitter<any>();
    @Output() public readonly firstVenueDocumentsChange = new EventEmitter<any>();
    @Output() public readonly secondVenueDocumentsChange = new EventEmitter<any>();
    public defaultLogoPath = 'assets/img/iihf-logo-without-text-transparent.png';
    public projectDetailForm: FormGroup;
    public yearPattern = Regex.yearPattern;
    public numericPattern = Regex.numericPattern;
    public notOnlyWhiteCharactersPattern = Regex.notOnlyWhiteCharactersPattern;
    public dateInvalid = false;
    public firstVenueMapSources: any[] = [];
    public firstVenueImageSources: any[] = [];
    public firstVenueDocumentSources: any[] = [];
    public firstVenueMapNames: string[];
    public firstVenueImageNames: string[];
    public firstVenueDocumentNames: string[];
    public firstVenueMapBlobs: any[];
    public firstVenueImageBlobs: any[];
    public firstVenueDocumentBlobs: any[];
    public firstVenueMapPaths: any[];
    public firstVenueImagePaths: any[];
    public firstVenueDocumentPaths: any[];
    public secondVenueMapSources: any[] = [];
    public secondVenueImageSources: any[] = [];
    public secondVenueDocumentSources: any[] = [];
    public secondVenueMapNames: string[];
    public secondVenueImageNames: string[];
    public secondVenueDocumentNames: string[];
    public secondVenueMapBlobs: any[];
    public secondVenueImageBlobs: any[];
    public secondVenueDocumentBlobs: any[];
    public secondVenueMapPaths: any[];
    public secondVenueImagePaths: any[];
    public secondVenueDocumentPaths: any[];
    public imageSrc: any = this.defaultLogoPath;
    public countryList = [];
    public countriesLoading = false;
    public viewMaps = false;
    public viewImages = false;
    public viewDocuments = false;
    public documentFileTypes = [
        'pdf',
        'txt',
        'doc',
        'docx',
        'rtf',
        'xls',
        'xlsx',
        'csv',
        'zip',
        'jpeg'
    ];
    public let;
    private readonly pdfBlobType = 'application/pdf';
    private readonly attachmentDownloadErrorKey = 'error.attachmentDownload';
    private readonly attachmentUploadErrorKey = 'error.attachmentUpload';

    public constructor(private readonly formBuilder: FormBuilder,
                       private readonly domSanitizer: DomSanitizer,
                       private readonly businessAreaService: BusinessAreaService,
                       private readonly notificationService: NotificationService,
                       private readonly projectsService: ProjectsService,
                       private readonly imagesService: ImagesService,
                       private readonly attachmentService: AttachmentService,
                       private readonly matDialog: MatDialog,
                       public readonly projectEventService: ProjectEventService) {
    }

    public get attachmentType(): typeof AttachmentType {
        return AttachmentType;
    }

    public ngOnInit(): void {
        this.initializeForm();
        this.loadCountries();

        this.refreshSubject.subscribe(() => {
            this.loadProjectDetail();
        });

        this.loadProjectDetail();
        this.projectDetailForm.disable();

        this.projectDetailForm.valueChanges.subscribe(() => {
            this.emitFormDataChangeEmitter();
            this.emitFirstVenueMapsChangeEmitter();
            this.emitSecondVenueMapsChangeEmitter();
            this.emitFirstVenueImagesChangeEmitter();
            this.emitSecondVenueImagesChangeEmitter();
            this.emitFirstVenueDocumentsChangeEmitter();
            this.emitSecondVenueDocumentsChangeEmitter();
        });
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (!this.projectDetailForm) {
            return;
        }
        const editMode = changes.editMode;
        if (!editMode.currentValue) {
            this.projectDetailForm.disable();
        } else {
            this.projectDetailForm.enable();
            this.projectDetailForm.markAsUntouched();
        }
    }

    public ngOnDestroy(): void {
        this.refreshSubject.unsubscribe();
    }

    public dateClass = (date: Date): string | undefined => {
        const weekDaysMinusOne = 6;
        const day = moment(date)
            .toDate()
            .getDay();

        return (day === 0 || day === weekDaysMinusOne) ? 'custom-date-class' : undefined;
    }

    public onDateChanged(): void {
        this.dateInvalid = true;
    }

    public hasError(controlName: string, errorName: string): boolean {
        return this.projectDetailForm.controls[controlName].hasError(errorName);
    }

    public isTouched(controlName: string): boolean {
        return this.projectDetailForm.controls[controlName].touched;
    }

    public isEmpty(controlName: string): boolean {
        return !this.projectDetailForm.controls[controlName].value;
    }

    public resetFirstVenueMap(index: number): void {
        this.firstVenueMapNames.splice(index, 1);
        this.firstVenueMapBlobs.splice(index, 1);
        this.firstVenueMapSources.splice(index, 1);
        this.firstVenueMapPaths.splice(index, 1);
        if (this.firstVenueMapNames && this.firstVenueMapNames.length === 0) {
            this.projectDetailForm.controls.firstMap.patchValue('');
        }
    }

    public resetSecondVenueMap(index: number): void {
        this.secondVenueMapNames.splice(index, 1);
        this.secondVenueMapBlobs.splice(index, 1);
        this.secondVenueMapSources.splice(index, 1);
        this.secondVenueMapPaths.splice(index, 1);
        if (this.secondVenueMapNames && this.secondVenueMapNames.length === 0) {
            this.projectDetailForm.controls.secondMap.patchValue('');
        }
    }

    public resetFirstVenueImage(index: number): void {
        this.firstVenueImageNames.splice(index, 1);
        this.firstVenueImageBlobs.splice(index, 1);
        this.firstVenueImageSources.splice(index, 1);
        this.firstVenueImagePaths.splice(index, 1);
        if (this.firstVenueImageNames && this.firstVenueImageNames.length === 0) {
            this.projectDetailForm.controls.firstImage.patchValue('');
        }
    }

    public resetSecondVenueImage(index: number): void {
        this.secondVenueImageNames.splice(index, 1);
        this.secondVenueImageBlobs.splice(index, 1);
        this.secondVenueImageSources.splice(index, 1);
        this.secondVenueImagePaths.splice(index, 1);
        if (this.secondVenueImageNames && this.secondVenueImageNames.length === 0) {
            this.projectDetailForm.controls.secondImage.patchValue('');
        }
    }

    public resetFirstVenueDocument(index: number): void {
        this.firstVenueDocumentNames.splice(index, 1);
        this.firstVenueDocumentBlobs.splice(index, 1);
        this.firstVenueDocumentSources.splice(index, 1);
        this.firstVenueDocumentPaths.splice(index, 1);
        if (this.firstVenueDocumentNames && this.firstVenueDocumentNames.length === 0) {
            this.projectDetailForm.controls.firstDocument.patchValue('');
        }
    }

    public resetSecondVenueDocument(index: number): void {
        this.secondVenueDocumentNames.splice(index, 1);
        this.secondVenueDocumentBlobs.splice(index, 1);
        this.secondVenueDocumentSources.splice(index, 1);
        this.secondVenueDocumentPaths.splice(index, 1);
        if (this.secondVenueDocumentNames && this.secondVenueDocumentNames.length === 0) {
            this.projectDetailForm.controls.secondDocument.patchValue('');
        }
    }

    public onFirstMapDropped(files: any): void | undefined {
        const file: File = files[0];
        if (!file) {
            this.projectDetailForm.controls.firstMap.patchValue('');

            return;
        }
        this.firstMapUpdate(file);
    }

    public onFirstMapInserted(event): void | undefined {
        const file = event.target.files[0];
        if (!file) {
            this.projectDetailForm.controls.firstMap.patchValue('');

            return;
        }
        this.firstMapUpdate(file);
    }

    public onSecondMapDropped(files: any): void | undefined {
        const file: File = files[0];
        if (!file) {
            this.projectDetailForm.controls.secondMap.patchValue('');

            return;
        }
        this.secondMapUpdate(file);
    }

    public onSecondMapInserted(event): void | undefined {
        const file = event.target.files[0];
        if (!file) {
            this.projectDetailForm.controls.secondMap.patchValue('');

            return;
        }
        this.secondMapUpdate(file);
    }

    public onFirstImageDropped(files: any): void | undefined {
        const file: File = files[0];
        if (!file) {
            this.projectDetailForm.controls.firstImage.patchValue('');

            return;
        }
        this.firstImageUpdate(file);
    }

    public onFirstImageInserted(event): void | undefined {
        const file = event.target.files[0];
        if (!file) {
            this.projectDetailForm.controls.firstImage.patchValue('');

            return;
        }
        this.firstImageUpdate(file);
    }

    public onSecondImageDropped(files: any): void | undefined {
        const file: File = files[0];
        if (!file) {
            this.projectDetailForm.controls.secondImage.patchValue('');

            return;
        }
        this.secondImageUpdate(file);
    }

    public onSecondImageInserted(event): void | undefined {
        const file = event.target.files[0];
        if (!file) {
            this.projectDetailForm.controls.secondImage.patchValue('');

            return;
        }
        this.secondImageUpdate(file);
    }

    public onFirstDocumentDropped(files: any): void | undefined {
        const file: File = files[0];
        if (!file || !this.documentFileTypes.includes(this.getFileEnding(file.name))) {
            this.projectDetailForm.controls.firstDocument.patchValue('');

            return;
        }
        this.firstDocumentUpdate(file);
    }

    public onFirstDocumentInserted(event): void | undefined {
        const file = event.target.files[0];
        if (!file || !this.documentFileTypes.includes(this.getFileEnding(file.name))) {
            this.projectDetailForm.controls.firstDocument.patchValue('');

            return;
        }
        this.firstDocumentUpdate(file);
    }

    public onSecondDocumentDropped(files: any): void | undefined {
        const file: File = files[0];
        if (!file || !this.documentFileTypes.includes(this.getFileEnding(file.name))) {
            this.projectDetailForm.controls.secondDocument.patchValue('');

            return;
        }
        this.secondDocumentUpdate(file);
    }

    public onSecondDocumentInserted(event): void | undefined {
        const file = event.target.files[0];
        if (!file || !this.documentFileTypes.includes(this.getFileEnding(file.name))) {
            this.projectDetailForm.controls.secondDocument.patchValue('');

            return;
        }
        this.secondDocumentUpdate(file);
    }

    public toggleMaps(): void {
        this.viewMaps = !this.viewMaps;
    }

    public toggleImages(): void {
        this.viewImages = !this.viewImages;
    }

    public toggleDocuments(): void {
        this.viewDocuments = !this.viewDocuments;
    }

    public onLogoInserted(event): void | undefined {
        const file = event.target.files[0];
        if (!file) {
            return;
        }
        const reader = new FileReader();
        reader.onload = (): any => {
            this.imageSrc = reader.result;
            this.imagesService.uploadImages([file])
                .subscribe((data: any): any => {
                    this.projectDetailForm.controls.logoUploadId.patchValue(data.fileNames[file.name].replace(/^.*[\\\/]/, ''));
                }, () => {
                    this.imageSrc = this.defaultLogoPath;
                    this.notificationService.openErrorNotification('error.imageUpload');
                });
        };
        reader.readAsDataURL(file);
    }

    public download(blob: Blob, type: string, name: string): void {
        BlobManager.downloadFromBlob(blob, this.pdfBlobType, name);
    }

    public isAnyFirstVenueFile(): boolean {
        return (this.firstVenueMapNames && this.firstVenueMapNames.length > 0) ||
            (this.firstVenueImageNames && this.firstVenueImageNames.length > 0) ||
            (this.firstVenueDocumentNames && this.firstVenueDocumentNames.length > 0);
    }

    public isAnySecondVenueFile(): boolean {
        return (this.secondVenueMapNames && this.secondVenueMapNames.length > 0) ||
            (this.secondVenueImageNames && this.secondVenueImageNames.length > 0) ||
            (this.secondVenueDocumentNames && this.secondVenueDocumentNames.length > 0);
    }

    public downloadFirstVenueDocs(): void {
        for (let i = 0; i < this.firstVenueMapNames.length; i++) {
            BlobManager.downloadFromBlob(this.firstVenueMapBlobs[i], this.pdfBlobType, this.firstVenueMapNames[i]);
        }
        for (let i = 0; i < this.firstVenueImageNames.length; i++) {
            BlobManager.downloadFromBlob(this.firstVenueImageBlobs[i], this.getContentTypeFromFileName(this.firstVenueImageNames[i]), this.firstVenueImageNames[i]);
        }
        for (let i = 0; i < this.firstVenueDocumentNames.length; i++) {
            BlobManager.downloadFromBlob(this.firstVenueDocumentBlobs[i], this.getContentTypeFromFileName(this.firstVenueDocumentNames[i]), this.firstVenueDocumentNames[i]);
        }
    }

    public downloadSecondVenueDocs(): void {
        for (let i = 0; i < this.secondVenueMapNames.length; i++) {
            BlobManager.downloadFromBlob(this.secondVenueMapBlobs[i], this.pdfBlobType, this.secondVenueMapNames[i]);
        }
        for (let i = 0; i < this.secondVenueImageNames.length; i++) {
            BlobManager.downloadFromBlob(this.secondVenueImageBlobs[i], this.getContentTypeFromFileName(this.secondVenueImageNames[i]), this.secondVenueImageNames[i]);
        }
        for (let i = 0; i < this.secondVenueDocumentNames.length; i++) {
            BlobManager.downloadFromBlob(this.secondVenueDocumentBlobs[i], this.getContentTypeFromFileName(this.secondVenueDocumentNames[i]), this.secondVenueDocumentNames[i]);
        }
    }

    public isJpegJpgOrPdfFromName(name: string): boolean {
        return [
            'jpg',
            'jpeg',
            'pdf'
        ].includes(this.getFileEnding(name));
    }

    public openDialog(source: any): void {
        this.matDialog.open(PdfDialogComponent, {
            maxHeight: '90vh',
            minHeight: '90vh',
            maxWidth: '80vw',
            minWidth: '80vw',
            data: {
                source
            }
        });
    }

    public openImageDialog(source: any): void {
        this.matDialog.open(ImageDialogComponent, {
            maxHeight: '90vh',
            minHeight: '90vh',
            maxWidth: '80vw',
            minWidth: '80vw',
            data: {
                image: source
            }
        });
    }

    public trackCountryById(index: number, item: Country): any {
        return item.id;
    }

    public getFileEnding(filePath: string): string | undefined {
        if (!filePath) {
            return;
        }

        return filePath.substr(filePath.lastIndexOf('.') + 1)
                       .toLowerCase();
    }

    public unshiftSecondVenueImage = (file: any, reader: FileReader, data: any): void => {
        this.secondVenueImageNames.unshift(file.name);
        this.secondVenueImageSources.unshift(reader.result);
        this.secondVenueImagePaths.unshift(data.fileNames[file.name]);
    }

    public unshiftFirstVenueDocument = (file: any, reader: FileReader, data: any): void => {
        this.firstVenueDocumentNames.unshift(file.name);
        this.firstVenueDocumentPaths.unshift(reader.result);
        this.firstVenueDocumentPaths.unshift(data.fileNames[file.name]);
    }

    public unshiftSecondVenueDocument = (file: any, reader: FileReader, data: any): void => {
        this.secondVenueDocumentNames.unshift(file.name);
        this.secondVenueDocumentSources.unshift(reader.result);
        this.secondVenueDocumentPaths.unshift(data.fileNames[file.name]);
    }

    public trackSourceBySelf(index: number, source: any): any {
        return source;
    }

    /**
     * Emit data for wrapper form create or form edit component
     */
    private emitFormDataChangeEmitter(): void {
        if (this.projectDetailForm.invalid) {
            this.formDataChange.emit(null);
        } else {
            const actualValue = {
                ...this.projectDetailForm.value,
            };
            this.formDataChange.emit(actualValue);
        }
    }

    private emitFirstVenueMapsChangeEmitter(): void {
        const actualValue = {
            'sources': this.firstVenueMapSources,
            'names': this.firstVenueMapNames,
            'blobs': this.firstVenueMapBlobs,
            'paths': this.firstVenueMapPaths,
        };
        this.firstVenueMapsChange.emit(actualValue);
    }

    private emitSecondVenueMapsChangeEmitter(): void {
        const actualValue = {
            'sources': this.secondVenueMapSources,
            'names': this.secondVenueMapNames,
            'blobs': this.secondVenueMapBlobs,
            'paths': this.secondVenueMapPaths,
        };
        this.secondVenueMapsChange.emit(actualValue);
    }

    private emitFirstVenueImagesChangeEmitter(): void {
        const actualValue = {
            'sources': this.firstVenueImageSources,
            'names': this.firstVenueImageNames,
            'blobs': this.firstVenueImageBlobs,
            'paths': this.firstVenueImagePaths,
        };
        this.firstVenueImagesChange.emit(actualValue);
    }

    private emitSecondVenueImagesChangeEmitter(): void {
        const actualValue = {
            'sources': this.secondVenueImageSources,
            'names': this.secondVenueImageNames,
            'blobs': this.secondVenueImageBlobs,
            'paths': this.secondVenueImagePaths,
        };
        this.secondVenueImagesChange.emit(actualValue);
    }

    private emitFirstVenueDocumentsChangeEmitter(): void {
        const actualValue = {
            'sources': this.firstVenueDocumentSources,
            'names': this.firstVenueDocumentNames,
            'blobs': this.firstVenueDocumentBlobs,
            'paths': this.firstVenueDocumentPaths,
        };
        this.firstVenueDocumentsChange.emit(actualValue);
    }

    private emitSecondVenueDocumentsChangeEmitter(): void {
        const actualValue = {
            'sources': this.secondVenueDocumentSources,
            'names': this.secondVenueDocumentNames,
            'blobs': this.secondVenueDocumentBlobs,
            'paths': this.secondVenueDocumentPaths,
        };
        this.secondVenueDocumentsChange.emit(actualValue);
    }

    private loadCountries(): void {
        this.countriesLoading = true;
        this.businessAreaService.listCountries()
            .pipe(finalize((): any => this.countriesLoading = false))
            .subscribe((data: BrowseResponse<Country>) => {
                this.countryList = data.content.filter((item: Country) => item.state === 'VALID');
            }, () => {
                this.notificationService.openErrorNotification('error.api');
            });
    }

    private loadProjectDetail(): void {
        this.projectsService.getProjectByProjectId(this.projectEventService.instant.id)
            .subscribe((data: ProjectDetail) => {
                this.setFormWithDetailData(data);
            }, () => {
                this.notificationService.openErrorNotification('error.getProjectDetail');
            });
    }

    private setFormWithDetailData(projectDetail: ProjectDetail): void {
        this.clearFileHolders();

        this.projectDetailForm.patchValue({
            name: projectDetail.name,
            year: projectDetail.year,
            status: projectDetail.state,
        });

        this.setFormProperty('dateFrom', projectDetail.dateFrom);
        this.setFormProperty('dateTo', projectDetail.dateTo);
        this.setFormProperty('description', projectDetail.description);
        this.setDataFromLogo(projectDetail.logo);

        if (projectDetail.id) {
            this.projectDetailForm.controls.projectId.patchValue(projectDetail.id);
        }

        const firstScreenPositionValue = 1;
        const firstCountryObject = projectDetail.projectVenues.find((projectVenue: VenueDetail) => projectVenue.screenPosition === firstScreenPositionValue);
        this.setFormFromFirstCountry(firstCountryObject);

        const secondScreenPositionValue = 2;
        const secondCountryObject = projectDetail.projectVenues.find((projectVenue: VenueDetail) => projectVenue.screenPosition === secondScreenPositionValue);
        this.setFormFromSecondCountry(secondCountryObject);

        this.setFirstVenueFilesByCountryObject(firstCountryObject);
        this.setSecondVenueFilesByCountryObject(secondCountryObject);

    }

    // TODO: add type
    private firstMapUpdate(file: any): void {
        const reader = new FileReader();
        reader.onload = (): void => {
            this.attachmentService.uploadAttachment([file])
                .subscribe((data: any): void => {
                    this.firstVenueMapNames.unshift(file.name);
                    this.firstVenueMapSources.unshift(reader.result);
                    this.firstVenueMapPaths.unshift(data.fileNames[file.name]);
                }, () => {
                    this.notificationService.openErrorNotification(this.attachmentUploadErrorKey);
                });
        };
        reader.readAsDataURL(file);
    }

    private secondMapUpdate(file: any): void {
        const reader = new FileReader();
        reader.onload = (): void => {
            this.attachmentService.uploadAttachment([file])
                .subscribe((data: any): void => {
                    this.secondVenueMapNames.unshift(file.name);
                    this.secondVenueMapSources.unshift(reader.result);
                    this.secondVenueMapPaths.unshift(data.fileNames[file.name]);
                }, () => {
                    this.notificationService.openErrorNotification(this.attachmentUploadErrorKey);
                });
        };
        reader.readAsDataURL(file);
    }

    private firstImageUpdate(file: any): void {
        const reader = new FileReader();
        reader.onload = (): void => {
            if (this.fileIsImage(file)) {
                this.imagesService.uploadImages([file])
                    .subscribe((data: any): void => {
                        this.firstVenueImageNames.unshift(file.name);
                        this.firstVenueImageSources.unshift(reader.result);
                        this.firstVenueImagePaths.unshift(data.fileNames[file.name]);
                        this.emitFirstVenueImagesChangeEmitter();
                    }, () => {
                        this.notificationService.openErrorNotification(this.attachmentUploadErrorKey);
                    });
            } else {
                this.attachmentService.uploadAttachment([file])
                    .subscribe((data: any): void => {
                        this.firstVenueImageNames.unshift(file.name);
                        this.firstVenueImageSources.unshift(reader.result);
                        this.firstVenueImagePaths.unshift(data.fileNames[file.name]);
                    }, () => {
                        this.notificationService.openErrorNotification(this.attachmentUploadErrorKey);
                    });
            }

        };
        reader.readAsDataURL(file);
    }

    private secondImageUpdate(file: any): void {
        const reader = new FileReader();
        reader.onload = (): void => {
            if (this.fileIsImage(file)) {
                this.imagesService.uploadImages([file])
                    .subscribe((data: any): void => this.unshiftSecondVenueImage(file, reader, data), () => {
                        this.notificationService.openErrorNotification(this.attachmentUploadErrorKey);
                    });
            } else {
                this.attachmentService.uploadAttachment([file])
                    .subscribe((data: any): void => this.unshiftSecondVenueImage(file, reader, data), () => {
                        this.notificationService.openErrorNotification(this.attachmentUploadErrorKey);
                    });
            }

        };
        reader.readAsDataURL(file);
    }

    private firstDocumentUpdate(file: any): void {
        const reader = new FileReader();
        reader.onload = (): void => {
            if (this.fileIsImage(file)) {
                this.imagesService.uploadImages([file])
                    .subscribe((data: any): void => this.unshiftFirstVenueDocument(file, reader, data), () => {
                        this.notificationService.openErrorNotification(this.attachmentUploadErrorKey);
                    });
            } else {
                this.attachmentService.uploadAttachment([file])
                    .subscribe((data: any): void => this.unshiftFirstVenueDocument(file, reader, data), () => {
                        this.notificationService.openErrorNotification(this.attachmentUploadErrorKey);
                    });
            }
        };
        reader.readAsDataURL(file);
    }

    private secondDocumentUpdate(file: any): void {
        const reader = new FileReader();
        reader.onload = (): void => {
            if (this.fileIsImage(file)) {
                this.imagesService.uploadImages([file])
                    .subscribe((data: any): void => this.unshiftSecondVenueDocument(file, reader, data), () => {
                        this.notificationService.openErrorNotification(this.attachmentUploadErrorKey);
                    });
            } else {
                this.attachmentService.uploadAttachment([file])
                    .subscribe((data: any): void => this.unshiftSecondVenueDocument(file, reader, data), () => {
                        this.notificationService.openErrorNotification(this.attachmentUploadErrorKey);
                    });
            }
        };
        reader.readAsDataURL(file);
    }

    private setFormFromFirstCountry(firstCountryObject: any): void {
        if (firstCountryObject) {
            this.projectDetailForm.controls.firstCountry.patchValue(firstCountryObject.clCountry.id);
            if (firstCountryObject.cityName) {
                this.projectDetailForm.controls.firstVenue.patchValue(firstCountryObject.cityName);
                this.projectDetailForm.controls.oldFirstVenue.patchValue(firstCountryObject.cityName);
                if (firstCountryObject.attachment && firstCountryObject.attachment.filePath) {
                    let attachments = [];
                    const attachmentsUpload = [];
                    if (firstCountryObject.attachment instanceof Array) {
                        attachments = attachments.concat(firstCountryObject.attachment);
                        firstCountryObject.attachment.forEach((item: any): void => {
                            attachmentsUpload.push({
                                id: item.filePath,
                                name: item.fileName
                            });
                        });
                    } else {
                        attachments.push(firstCountryObject.attachment);
                        attachmentsUpload.push({
                            id: firstCountryObject.attachment.filePath,
                            name: firstCountryObject.attachment.fileName
                        });
                    }
                    this.projectDetailForm.controls.firstMap.patchValue(attachments);
                    this.projectDetailForm.controls.firstMapUpload.patchValue(attachmentsUpload);
                }
            } else {
                this.projectDetailForm.controls.firstVenue.patchValue('');
                this.projectDetailForm.controls.oldFirstVenue.patchValue('');
            }
        } else {
            this.projectDetailForm.controls.firstCountry.patchValue('');
            this.projectDetailForm.controls.firstVenue.patchValue('');
            this.projectDetailForm.controls.oldFirstVenue.patchValue('');
        }
    }

    private setFormFromSecondCountry(secondCountryObject: any): void {
        if (secondCountryObject) {
            this.projectDetailForm.controls.secondCountry.patchValue(secondCountryObject.clCountry.id);
            if (secondCountryObject.cityName) {
                this.projectDetailForm.controls.oldSecondVenue.patchValue(secondCountryObject.cityName);
                this.projectDetailForm.controls.secondVenue.patchValue(secondCountryObject.cityName);
                if (secondCountryObject.attachment && secondCountryObject.attachment.filePath) {
                    let attachments = [];
                    const attachmentsUpload = [];
                    if (secondCountryObject.attachment instanceof Array) {
                        attachments = attachments.concat(secondCountryObject.attachment);
                        secondCountryObject.attachment.forEach((item: any): void => {
                            attachmentsUpload.push({
                                id: item.filePath,
                                name: item.fileName
                            });
                        });
                    } else {
                        attachments.push(secondCountryObject.attachment);
                        attachmentsUpload.push({
                            id: secondCountryObject.attachment.filePath,
                            name: secondCountryObject.attachment.fileName
                        });
                    }
                    this.projectDetailForm.controls.secondMap.patchValue(attachments);
                    this.projectDetailForm.controls.secondMapUpload.patchValue(attachmentsUpload);
                }
            } else {
                this.projectDetailForm.controls.secondVenue.patchValue('');
                this.projectDetailForm.controls.oldSecondVenue.patchValue('');
            }
        } else {
            this.projectDetailForm.controls.secondCountry.patchValue('');
            this.projectDetailForm.controls.secondVenue.patchValue('');
            this.projectDetailForm.controls.oldSecondVenue.patchValue('');
        }

    }

    private fileIsImage(file: any): boolean {
        return file.type.startsWith('image');
    }

    private firstCountryEmptyWhenFirstVenue(): any {
        return (group: FormGroup): {[key: string]: any} => {
            const firstCountryEmptyWhenFirstVenue = this.editMode && this.projectDetailForm.controls.firstVenue.value && !this.projectDetailForm.controls.firstCountry.value;

            return firstCountryEmptyWhenFirstVenue ? {firstCountryEmptyWhenSecondCountry: firstCountryEmptyWhenFirstVenue} : null;
        };
    }

    private secondCountryEmptyWhenSecondVenue(): any {
        return (group: FormGroup): {[key: string]: any} => {
            const secondCountryEmptyWhenSecondVenue = this.editMode && this.projectDetailForm.controls.secondVenue.value && !this.projectDetailForm.controls.secondCountry.value;

            return secondCountryEmptyWhenSecondVenue ? {secondCountryEmptyWhenSecondVenue} : null;

        };
    }

    private firstCountryEmptyWhenSecondCountry(): any {
        return (group: FormGroup): {[key: string]: any} => {
            const firstCountryEmptyWhenSecondCountry = this.editMode && this.projectDetailForm.controls.secondCountry.value && !this.projectDetailForm.controls.firstCountry.value;

            return firstCountryEmptyWhenSecondCountry ? {firstCountryEmptyWhenSecondCountry} : null;

        };
    }

    private firstVenueEmptyWhenFirstVenueFile(): any {
        return (group: FormGroup): {[key: string]: any} => {
            const firstVenueEmptyWhenFirstVenueAnyFile = this.editMode &&
                (this.projectDetailForm.value.firstMap || this.projectDetailForm.value.firstImage || this.projectDetailForm.value.firstDocument) &&
                !this.projectDetailForm.controls.firstVenue.value;

            return firstVenueEmptyWhenFirstVenueAnyFile ? {firstVenueEmptyWhenFirstVenueAnyFile} : null;

        };
    }

    private secondVenueEmptyWhenSecondVenueFile(): any {
        return (group: FormGroup): {[key: string]: any} => {
            const secondVenueEmptyWhenSecondVenueAnyFile = this.editMode &&
                (this.projectDetailForm.value.secondMap || this.projectDetailForm.value.secondImage || this.projectDetailForm.value.secondDocument) &&
                !this.projectDetailForm.controls.secondVenue.value;

            return secondVenueEmptyWhenSecondVenueAnyFile ? {secondVenueEmptyWhenSecondVenueAnyFile} : null;
        };
    }

    private initializeForm(): void {
        this.projectDetailForm = this.formBuilder.group({
            projectId: [''],
            logo: [''],
            name: [''],
            year: [''],
            status: [''],
            dateFrom: [''],
            dateTo: [''],
            firstCountry: [''],
            secondCountry: [''],
            oldFirstVenue: [''],
            firstVenue: [''],
            oldSecondVenue: [''],
            secondVenue: [''],
            logoUploadId: [''],
            firstMap: [''],
            secondMap: [''],
            firstMapUpload: [[]],
            secondMapUpload: [[]],
            firstImage: [''],
            secondImage: [''],
            firstImageUpload: [[]],
            secondImageUpload: [[]],
            firstDocument: [''],
            secondDocument: [''],
            firstDocumentUpload: [[]],
            secondDocumentUpload: [[]],
            description: [''],
        }, {
            validator: [
                this.firstCountryEmptyWhenFirstVenue(),
                this.secondCountryEmptyWhenSecondVenue(),
                this.firstCountryEmptyWhenSecondCountry(),
                this.firstVenueEmptyWhenFirstVenueFile(),
                this.secondVenueEmptyWhenSecondVenueFile(),
            ]
        });

    }

    private getContentTypeFromFileName(fileName: string): string {
        switch (this.getFileEnding(fileName)) {
            case 'pdf': {
                return this.pdfBlobType;
            }
            case 'jpeg': {
                return 'image/jpeg';
            }
            case 'txt': {
                return 'text/plain';
            }
            case 'rtf': {
                return '.rtf';
            }
            case 'csv': {
                return '.csv';
            }
            case 'doc': {
                return '.doc';
            }
            case 'docx': {
                return '.docx';
            }
            case 'xls': {
                return '.application/vnd.ms-excel';
            }
            case 'xlsx': {
                return '.application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
            }
            case 'zip': {
                return '.zip';
            }
            default: {
                return '*';
            }
        }
    }

    private setFormProperty(propertyName: string, value: any): void {
        if (value) {
            this.projectDetailForm.controls[propertyName].patchValue(value);
        } else {
            this.projectDetailForm.controls[propertyName].patchValue('');
        }
    }

    private setDataFromLogo(logo: any): void {
        if (logo) {
            this.projectDetailForm.controls.logoUploadId.patchValue(logo);
            this.imagesService.getImage(logo)
                .subscribe((blob: Blob): void => {
                    const reader = new FileReader();
                    reader.onload = (): void => {
                        this.imageSrc = reader.result;
                    };
                    reader.readAsDataURL(blob);
                }, () => {
                    this.notificationService.openErrorNotification('error.imageDownload');
                });
        } else {
            this.projectDetailForm.controls.logoUploadId.patchValue('');
            this.projectDetailForm.controls.logo.patchValue('');
            this.imageSrc = this.defaultLogoPath;
        }
    }

    private resetFirstVenueFiles(): void {
        this.firstVenueMapSources = [];
        this.firstVenueMapPaths = [];
        this.firstVenueImageSources = [];
        this.firstVenueImagePaths = [];
        this.firstVenueDocumentSources = [];
        this.firstVenueDocumentPaths = [];
        this.projectDetailForm.controls.firstMap.patchValue('');
        this.projectDetailForm.controls.firstImage.patchValue('');
        this.projectDetailForm.controls.firstDocument.patchValue('');
    }

    private resetSecondVenueFiles(): void {
        this.secondVenueMapSources = [];
        this.secondVenueMapPaths = [];
        this.secondVenueImageSources = [];
        this.secondVenueImagePaths = [];
        this.secondVenueDocumentSources = [];
        this.secondVenueDocumentPaths = [];
        this.projectDetailForm.controls.secondMap.patchValue('');
        this.projectDetailForm.controls.secondImage.patchValue('');
        this.projectDetailForm.controls.secondDocument.patchValue('');
    }

    private clearFileHolders(): void {
        this.firstVenueMapNames = [];
        this.firstVenueMapBlobs = [];
        this.firstVenueMapSources = [];
        this.firstVenueMapPaths = [];

        this.secondVenueMapNames = [];
        this.secondVenueMapBlobs = [];
        this.secondVenueMapSources = [];
        this.secondVenueMapPaths = [];

        this.firstVenueImageNames = [];
        this.firstVenueImageBlobs = [];
        this.firstVenueImageSources = [];
        this.firstVenueImagePaths = [];

        this.secondVenueImageNames = [];
        this.secondVenueImageBlobs = [];
        this.secondVenueImageSources = [];
        this.secondVenueImagePaths = [];

        this.firstVenueDocumentNames = [];
        this.firstVenueDocumentBlobs = [];
        this.firstVenueDocumentSources = [];
        this.firstVenueDocumentPaths = [];

        this.secondVenueDocumentNames = [];
        this.secondVenueDocumentBlobs = [];
        this.secondVenueDocumentSources = [];
        this.secondVenueDocumentPaths = [];
    }

    private addFirstVenueMapHolder(blob: Blob, attachment: AttachmentDetail): void {
        const reader = new FileReader();
        reader.onload = (): any => {
            this.firstVenueMapSources.unshift(reader.result);
            this.firstVenueMapPaths.unshift(attachment.filePath);
            this.firstVenueMapNames.unshift(attachment.fileName);
            this.firstVenueMapBlobs.unshift(blob);
        };
        reader.readAsDataURL(blob);
    }

    private addFirstVenueImageHolder(blob: Blob, attachment: AttachmentDetail): void {
        const reader = new FileReader();
        reader.onload = (): void => {
            this.firstVenueImageSources.unshift(reader.result);
            this.firstVenueImagePaths.unshift(attachment.filePath);
            this.firstVenueImageNames.unshift(attachment.fileName);
            this.firstVenueImageBlobs.unshift(blob);
        };
        reader.readAsDataURL(blob);
    }

    private addFirstVenueDocumentHolder(blob: Blob, attachment: AttachmentDetail): void {
        const reader = new FileReader();
        reader.onload = (): void => {
            this.firstVenueDocumentSources.unshift(reader.result);
            this.firstVenueDocumentPaths.unshift(attachment.filePath);
            this.firstVenueDocumentNames.unshift(attachment.fileName);
            this.firstVenueDocumentBlobs.unshift(blob);
        };
        reader.readAsDataURL(blob);
    }

    private addSecondVenueMapHolder(blob: Blob, attachment: AttachmentDetail): void {
        const reader = new FileReader();
        reader.onload = (): void => {
            this.secondVenueMapSources.unshift(reader.result);
            this.secondVenueMapPaths.unshift(attachment.filePath);
            this.secondVenueMapNames.unshift(attachment.fileName);
            this.secondVenueMapBlobs.unshift(blob);
        };
        reader.readAsDataURL(blob);
    }

    private addSecondVenueImageHolder(blob: Blob, attachment: AttachmentDetail): void {
        const reader = new FileReader();
        reader.onload = (): void => {
            this.secondVenueImageBlobs.unshift(blob);
            this.secondVenueImageSources.unshift(reader.result);
            this.secondVenueImagePaths.unshift(attachment.filePath);
            this.secondVenueImageNames.unshift(attachment.fileName);
        };
        reader.readAsDataURL(blob);
    }

    private addSecondVenueDocumentHolder(blob: Blob, attachment: AttachmentDetail): void {
        const reader = new FileReader();
        reader.onload = (): void => {
            this.secondVenueDocumentSources.unshift(reader.result);
            this.secondVenueDocumentPaths.unshift(attachment.filePath);
            this.secondVenueDocumentBlobs.unshift(blob);
            this.secondVenueDocumentNames.unshift(attachment.fileName);
        };
        reader.readAsDataURL(blob);
    }

    private setFirstVenueMaps(firstCountryObject: any): void {
        const firstVenueMaps = firstCountryObject.attachments.filter((attachment: AttachmentDetail) => attachment.type === AttachmentType.Map);
        if (firstVenueMaps.length === 0) {
            this.projectDetailForm.controls.firstMap.patchValue('');
        }
        firstVenueMaps.forEach((attachment: AttachmentDetail) => {
            this.attachmentService.getAttachment(attachment.filePath)
                .subscribe((blob: Blob) => {
                    this.addFirstVenueMapHolder(blob, attachment);
                }, (): void => {
                    this.notificationService.openErrorNotification(this.attachmentDownloadErrorKey);
                });
        });
    }

    private setFirstVenueImages(firstCountryObject: any): void {
        const firstVenueImages = firstCountryObject.attachments.filter((attachment: AttachmentDetail) => attachment.type === AttachmentType.Image);
        if (firstVenueImages.length === 0) {
            this.projectDetailForm.controls.firstImage.patchValue('');
        }
        firstVenueImages.forEach((attachment: AttachmentDetail) => {
            if (this.getFileEnding(attachment.filePath) !== 'pdf') {
                this.imagesService.getImage(attachment.filePath)
                    .subscribe((blob: Blob) => {
                        this.addFirstVenueImageHolder(blob, attachment);
                    }, () => {
                        this.notificationService.openErrorNotification(this.attachmentDownloadErrorKey);
                    });
            } else {
                this.attachmentService.getAttachment(attachment.filePath)
                    .subscribe((blob: Blob) => {
                        this.addFirstVenueImageHolder(blob, attachment);
                    }, () => {
                        this.notificationService.openErrorNotification(this.attachmentDownloadErrorKey);
                    });
            }
        });
    }

    private setFirstVenueDocuments(firstCountryObject: any): void {
        const firstVenueDocuments = firstCountryObject.attachments.filter((attachment: AttachmentDetail) => attachment.type === AttachmentType.Document);
        if (firstVenueDocuments.length === 0) {
            this.projectDetailForm.controls.firstDocument.patchValue('');
        }
        firstVenueDocuments.forEach((attachment: AttachmentDetail) => {
            if (this.getFileEnding(attachment.filePath) === 'jpeg') {
                this.imagesService.getImage(attachment.filePath)
                    .subscribe((blob: Blob): void => {
                        this.addFirstVenueDocumentHolder(blob, attachment);
                    }, () => {
                        this.notificationService.openErrorNotification(this.attachmentDownloadErrorKey);
                    });
            } else {
                this.attachmentService.getAttachment(attachment.filePath)
                    .subscribe((blob: Blob) => {
                        this.addFirstVenueDocumentHolder(blob, attachment);
                    }, () => {
                        this.notificationService.openErrorNotification(this.attachmentDownloadErrorKey);
                    });
            }

        });
    }

    private setFirstVenueFilesByCountryObject(firstCountryObject: any): void {
        if (firstCountryObject && firstCountryObject.attachments.length > 0) {
            this.setFirstVenueMaps(firstCountryObject);
            this.setFirstVenueImages(firstCountryObject);
            this.setFirstVenueDocuments(firstCountryObject);
        } else if (!firstCountryObject || !(firstCountryObject.attachments.length > 0)) {
            this.resetFirstVenueFiles();
        }
    }

    private setSecondVenueFilesByCountryObject(secondCountryObject: any): void {
        if (secondCountryObject && secondCountryObject.attachments.length > 0) {
            this.setSecondVenueMap(secondCountryObject);
            this.setSecondVenueImage(secondCountryObject);
            this.setSecondVenueDocument(secondCountryObject);
        } else if (!secondCountryObject || !(secondCountryObject.attachments.length > 0)) {
            this.resetSecondVenueFiles();
        }
    }

    private setSecondVenueMap(secondCountryObject: any): void {
        const secondVenueMaps = secondCountryObject.attachments.filter((attachment: AttachmentDetail) => attachment.type === AttachmentType.Map);
        if (secondVenueMaps.length === 0) {
            this.projectDetailForm.controls.secondMap.patchValue('');
        }
        secondVenueMaps.forEach((attachment: AttachmentDetail) => {
            this.attachmentService.getAttachment(attachment.filePath)
                .subscribe((blob: Blob) => {
                    this.addSecondVenueMapHolder(blob, attachment);
                }, () => {
                    this.notificationService.openErrorNotification(this.attachmentDownloadErrorKey);
                });
        });
    }

    private setSecondVenueImage(secondCountryObject: any): void {
        const secondVenueImages = secondCountryObject.attachments.filter((attachment: AttachmentDetail) => attachment.type === AttachmentType.Image);
        if (secondVenueImages.length === 0) {
            this.projectDetailForm.controls.secondImage.patchValue('');
        }
        secondVenueImages.forEach((attachment: AttachmentDetail) => {
            if (this.getFileEnding(attachment.filePath) !== 'pdf') {
                this.imagesService.getImage(attachment.filePath)
                    .subscribe((blob: Blob) => {
                        this.addSecondVenueImageHolder(blob, attachment);
                    }, () => {
                        this.notificationService.openErrorNotification(this.attachmentDownloadErrorKey);
                    });
            } else {
                this.attachmentService.getAttachment(attachment.filePath)
                    .subscribe((blob: Blob) => {
                        this.addSecondVenueImageHolder(blob, attachment);
                    }, () => {
                        this.notificationService.openErrorNotification(this.attachmentDownloadErrorKey);
                    });
            }
        });
    }

    private setSecondVenueDocument(secondCountryObject: any): void {
        const secondVenueDocuments = secondCountryObject.attachments.filter((attachment: AttachmentDetail) => attachment.type === AttachmentType.Document);
        if (secondVenueDocuments.length === 0) {
            this.projectDetailForm.controls.secondDocument.patchValue('');
        }
        secondVenueDocuments.forEach((attachment: AttachmentDetail) => {
            if (this.getFileEnding(attachment.filePath) === 'jpeg') {
                this.imagesService.getImage(attachment.filePath)
                    .subscribe((blob: Blob) => {
                        this.addSecondVenueDocumentHolder(blob, attachment);
                    }, () => {
                        this.notificationService.openErrorNotification(this.attachmentDownloadErrorKey);
                    });
            } else {
                this.attachmentService.getAttachment(attachment.filePath)
                    .subscribe((blob: Blob): void => {
                        this.addSecondVenueDocumentHolder(blob, attachment);
                    }, () => {
                        this.notificationService.openErrorNotification(this.attachmentDownloadErrorKey);
                    });
            }
        });
    }

}
