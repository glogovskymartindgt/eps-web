import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
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
import { ProjectAttachmentService } from '../services/project-attachment.service';

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
    public defaultLogoPath = 'assets/img/iihf-logo-without-text-transparent.png';
    public projectDetailForm: FormGroup;
    public yearPattern = Regex.yearPattern;
    public numericPattern = Regex.numericPattern;
    public notOnlyWhiteCharactersPattern = Regex.notOnlyWhiteCharactersPattern;
    public dateInvalid = false;
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
                       public readonly projectEventService: ProjectEventService,
                       public readonly projectAttachmentService: ProjectAttachmentService) {
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

        setTimeout(() => {
            this.projectAttachmentService.orderAttachments();
        }, 1000);

        this.projectDetailForm.valueChanges.subscribe(() => {
            this.emitFormDataChangeEmitter();
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
    };

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
        this.projectAttachmentService.resetFirstVenueMap(index);
        if (this.projectAttachmentService.firstVenueAnyMaps()) {
            this.projectDetailForm.controls.firstMap.patchValue('');
        }
    }

    public resetSecondVenueMap(index: number): void {
        this.projectAttachmentService.resetSecondVenueMap(index);
        if (this.projectAttachmentService.secondVenueAnyMaps()) {
            this.projectDetailForm.controls.secondMap.patchValue('');
        }
    }

    public resetFirstVenueImage(index: number): void {
        this.projectAttachmentService.resetFirstVenueImage(index);
        if (this.projectAttachmentService.firstVenueAnyImages()) {
            this.projectDetailForm.controls.firstImage.patchValue('');
        }
    }

    public resetSecondVenueImage(index: number): void {
        this.projectAttachmentService.resetSecondVenueImage(index);
        if (this.projectAttachmentService.secondVenueAnyImages()) {
            this.projectDetailForm.controls.secondImage.patchValue('');
        }
    }

    public resetFirstVenueDocument(index: number): void {
        this.projectAttachmentService.resetFirstVenueDocument(index);
        if (this.projectAttachmentService.firstVenueAnyDocuments()) {
            this.projectDetailForm.controls.firstDocument.patchValue('');
        }
    }

    public resetSecondVenueDocument(index: number): void {
        this.projectAttachmentService.resetSecondVenueDocument(index);
        if (this.projectAttachmentService.secondVenueAnyDocuments()) {
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
        if (!file || !this.documentFileTypes.includes(this.projectAttachmentService.getFileEnding(file.name))) {
            this.projectDetailForm.controls.firstDocument.patchValue('');

            return;
        }
        this.firstDocumentUpdate(file);
    }

    public onFirstDocumentInserted(event): void | undefined {
        const file = event.target.files[0];
        if (!file || !this.documentFileTypes.includes(this.projectAttachmentService.getFileEnding(file.name))) {
            this.projectDetailForm.controls.firstDocument.patchValue('');

            return;
        }
        this.firstDocumentUpdate(file);
    }

    public onSecondDocumentDropped(files: any): void | undefined {
        const file: File = files[0];
        if (!file || !this.documentFileTypes.includes(this.projectAttachmentService.getFileEnding(file.name))) {
            this.projectDetailForm.controls.secondDocument.patchValue('');

            return;
        }
        this.secondDocumentUpdate(file);
    }

    public onSecondDocumentInserted(event): void | undefined {
        const file = event.target.files[0];
        if (!file || !this.documentFileTypes.includes(this.projectAttachmentService.getFileEnding(file.name))) {
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
        BlobManager.downloadFromBlob(blob, this.projectAttachmentService.getContentTypeFromFileName(name), name);
    }

    public isAnyFirstVenueFile(): boolean {
        return this.projectAttachmentService.firstVenueAnyFile();
    }

    public isAnySecondVenueFile(): boolean {
        return this.projectAttachmentService.secondVenueAnyFile();
    }

    public downloadFirstVenueDocs(): void {
        this.projectAttachmentService.files.firstVenueAttachments.maps.forEach(this.projectAttachmentService.downloadFromBlob);
        this.projectAttachmentService.files.firstVenueAttachments.images.forEach(this.projectAttachmentService.downloadFromBlob);
        this.projectAttachmentService.files.firstVenueAttachments.documents.forEach(this.projectAttachmentService.downloadFromBlob);
    }

    public downloadSecondVenueDocs(): void {
        this.projectAttachmentService.files.secondVenueAttachments.maps.forEach(this.projectAttachmentService.downloadFromBlob);
        this.projectAttachmentService.files.secondVenueAttachments.images.forEach(this.projectAttachmentService.downloadFromBlob);
        this.projectAttachmentService.files.secondVenueAttachments.documents.forEach(this.projectAttachmentService.downloadFromBlob);
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

    public unshiftSecondVenueImage = (file: any, reader: FileReader, data: any): void => {
        this.projectAttachmentService.addSecondVenueImage(new AttachmentDetail(file.name, data.fileNames[file.name], reader.result, null, null));
    };

    public unshiftFirstVenueDocument = (file: any, reader: FileReader, data: any): void => {
        this.projectAttachmentService.addFirstVenueDocument(new AttachmentDetail(file.name, data.fileNames[file.name], reader.result, null, null));
    };

    public unshiftSecondVenueDocument = (file: any, reader: FileReader, data: any): void => {
        this.projectAttachmentService.addSecondVenueDocument(new AttachmentDetail(file.name, data.fileNames[file.name], reader.result, null, null));
    };

    public trackSourceBySelf(index: number, source: any): any {
        return source;
    }

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
            .pipe(finalize(() => this.projectAttachmentService.orderAttachments()))
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

    private firstMapUpdate(file: any): void {
        const reader = new FileReader();
        reader.onload = (): void => {
            this.attachmentService.uploadAttachment([file])
                .subscribe((data: any): void => {
                    this.projectAttachmentService.addFirstVenueMap(new AttachmentDetail(file.name, data.fileNames[file.name], reader.result, null, null));
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
                    this.projectAttachmentService.addSecondVenueMap(new AttachmentDetail(file.name, data.fileNames[file.name], reader.result, null, null));
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
                        this.projectAttachmentService.addFirstVenueImage(new AttachmentDetail(file.name, data.fileNames[file.name], reader.result, null, null));
                    }, () => {
                        this.notificationService.openErrorNotification(this.attachmentUploadErrorKey);
                    });
            } else {
                this.attachmentService.uploadAttachment([file])
                    .subscribe((data: any): void => {
                        this.projectAttachmentService.addFirstVenueImage(new AttachmentDetail(file.name, data.fileNames[file.name], reader.result, null, null));
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

    private setFormCountry(countryObject: any,
                           countryControl: AbstractControl,
                           venueControl: AbstractControl,
                           oldVenueControl: AbstractControl,
                           mapControl: AbstractControl,
                           mapUploadControl: AbstractControl): void {
        if (countryObject) {
            countryControl.patchValue(countryObject.clCountry.id);
            if (countryObject.cityName) {
                venueControl.patchValue(countryObject.cityName);
                oldVenueControl.patchValue(countryObject.cityName);
                if (countryObject.attachment && countryObject.attachment.filePath) {
                    let attachments = [];
                    const attachmentsUpload = [];
                    if (countryObject.attachment instanceof Array) {
                        attachments = attachments.concat(countryObject.attachment);
                        countryObject.attachment.forEach((item: any): void => {
                            attachmentsUpload.push({
                                id: item.filePath,
                                name: item.fileName
                            });
                        });
                    } else {
                        attachments.push(countryObject.attachment);
                        attachmentsUpload.push({
                            id: countryObject.attachment.filePath,
                            name: countryObject.attachment.fileName
                        });
                    }
                    mapControl.patchValue(attachments);
                    mapUploadControl.patchValue(attachmentsUpload);
                }
            } else {
                venueControl.patchValue('');
                oldVenueControl.patchValue('');
            }
        } else {
            countryControl.patchValue('');
            venueControl.patchValue('');
            oldVenueControl.patchValue('');
        }
    }

    private setFormFromFirstCountry(countryObject: any): void {
        this.setFormCountry(
            countryObject,
            this.projectDetailForm.controls.firstCountry,
            this.projectDetailForm.controls.firstVenue,
            this.projectDetailForm.controls.oldFirstVenue,
            this.projectDetailForm.controls.firstMap,
            this.projectDetailForm.controls.firstMapUpload
        );
    }

    private setFormFromSecondCountry(countryObject: any): void {
        this.setFormCountry(
            countryObject,
            this.projectDetailForm.controls.secondCountry,
            this.projectDetailForm.controls.secondVenue,
            this.projectDetailForm.controls.oldSecondVenue,
            this.projectDetailForm.controls.secondMap,
            this.projectDetailForm.controls.secondMapUpload
        );
    }

    private fileIsImage(file: any): boolean {
        return file.type.startsWith('image');
    }

    private firstCountryEmptyWhenFirstVenue(): any {
        return (): {[key: string]: any} => {
            const firstCountryEmptyWhenFirstVenue = this.editMode && this.projectDetailForm.controls.firstVenue.value && !this.projectDetailForm.controls.firstCountry.value;

            return firstCountryEmptyWhenFirstVenue ? {firstCountryEmptyWhenSecondCountry: firstCountryEmptyWhenFirstVenue} : null;
        };
    }

    private secondCountryEmptyWhenSecondVenue(): any {
        return (): {[key: string]: any} => {
            const secondCountryEmptyWhenSecondVenue = this.editMode && this.projectDetailForm.controls.secondVenue.value && !this.projectDetailForm.controls.secondCountry.value;

            return secondCountryEmptyWhenSecondVenue ? {secondCountryEmptyWhenSecondVenue} : null;

        };
    }

    private firstCountryEmptyWhenSecondCountry(): any {
        return (): {[key: string]: any} => {
            const firstCountryEmptyWhenSecondCountry = this.editMode && this.projectDetailForm.controls.secondCountry.value && !this.projectDetailForm.controls.firstCountry.value;

            return firstCountryEmptyWhenSecondCountry ? {firstCountryEmptyWhenSecondCountry} : null;

        };
    }

    private firstVenueEmptyWhenFirstVenueFile(): any {
        return (): {[key: string]: any} => {
            const firstVenueEmptyWhenFirstVenueAnyFile = this.editMode &&
                (this.projectDetailForm.value.firstMap || this.projectDetailForm.value.firstImage || this.projectDetailForm.value.firstDocument) &&
                !this.projectDetailForm.controls.firstVenue.value;

            return firstVenueEmptyWhenFirstVenueAnyFile ? {firstVenueEmptyWhenFirstVenueAnyFile} : null;

        };
    }

    private secondVenueEmptyWhenSecondVenueFile(): any {
        return (): {[key: string]: any} => {
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
        this.projectAttachmentService.emptyFirstVenueFiles();
        this.projectDetailForm.controls.firstMap.patchValue('');
        this.projectDetailForm.controls.firstImage.patchValue('');
        this.projectDetailForm.controls.firstDocument.patchValue('');
    }

    private resetSecondVenueFiles(): void {
        this.projectAttachmentService.emptySecondVenueFiles();
        this.projectDetailForm.controls.secondMap.patchValue('');
        this.projectDetailForm.controls.secondImage.patchValue('');
        this.projectDetailForm.controls.secondDocument.patchValue('');
    }

    private clearFileHolders(): void {
        this.projectAttachmentService.empty();
    }

    private addFirstVenueMapHolder(blob: Blob, attachment: AttachmentDetail): void {
        const reader = new FileReader();
        reader.onload = (): any => {
            this.projectAttachmentService.addFirstVenueMap(new AttachmentDetail(attachment.fileName, attachment.filePath, reader.result, blob, attachment.order));
        };
        reader.readAsDataURL(blob);
    }

    private addFirstVenueImageHolder(blob: Blob, attachment: AttachmentDetail): void {
        const reader = new FileReader();
        reader.onload = (): void => {
            this.projectAttachmentService.addFirstVenueImage(new AttachmentDetail(attachment.fileName, attachment.filePath, reader.result, blob, attachment.order));
        };
        reader.readAsDataURL(blob);
    }

    private addFirstVenueDocumentHolder(blob: Blob, attachment: AttachmentDetail): void {
        const reader = new FileReader();
        reader.onload = (): void => {
            this.projectAttachmentService.addFirstVenueDocument(new AttachmentDetail(attachment.fileName, attachment.filePath, reader.result, blob, attachment.order));
        };
        reader.readAsDataURL(blob);
    }

    private addSecondVenueMapHolder(blob: Blob, attachment: AttachmentDetail): void {
        const reader = new FileReader();
        reader.onload = (): void => {
            this.projectAttachmentService.addSecondVenueMap(new AttachmentDetail(attachment.fileName, attachment.filePath, reader.result, blob, attachment.order));
        };
        reader.readAsDataURL(blob);
    }

    private addSecondVenueImageHolder(blob: Blob, attachment: AttachmentDetail): void {
        const reader = new FileReader();
        reader.onload = (): void => {
            this.projectAttachmentService.addSecondVenueImage(new AttachmentDetail(attachment.fileName, attachment.filePath, reader.result, blob, attachment.order));
        };
        reader.readAsDataURL(blob);
    }

    private addSecondVenueDocumentHolder(blob: Blob, attachment: AttachmentDetail): void {
        const reader = new FileReader();
        reader.onload = (): void => {
            this.projectAttachmentService.addSecondVenueDocument(new AttachmentDetail(attachment.fileName, attachment.filePath, reader.result, blob, attachment.order));
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
            if (this.projectAttachmentService.getFileEnding(attachment.filePath) !== 'pdf') {
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
            if (this.projectAttachmentService.getFileEnding(attachment.filePath) === 'jpeg') {
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
            if (this.projectAttachmentService.getFileEnding(attachment.filePath) !== 'pdf') {
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
            if (this.projectAttachmentService.getFileEnding(attachment.filePath) === 'jpeg') {
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

    public sortAttachmentDetailByOrderNumber(comparedAttachmentDetail, comparableAttachmentDetail): number {
        return comparedAttachmentDetail.order - comparableAttachmentDetail.order;
    }

}
