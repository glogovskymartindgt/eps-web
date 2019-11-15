import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import * as _moment from 'moment';
import { Subject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { PdfDialogComponent } from '../../../shared/components/dialog/pdf-dialog/pdf-dialog.component';
import { ImageDialogComponent } from '../../../shared/components/dialog/image-dialog/image-dialog.component';

import { AttachmentType } from '../../../shared/enums/attachment-type.enum';
import { enterLeave, fadeEnterLeave } from '../../../shared/hazlenut/hazelnut-common/animations';
import { Regex } from '../../../shared/hazlenut/hazelnut-common/regex/regex';
import { Country } from '../../../shared/models/country.model';
import { ProjectDetail } from '../../../shared/models/project-detail.model';
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
    @Output('formDataChange') public onFormDataChange = new EventEmitter<any>();
    @Output('firstVenueMapsChange') public onFirstVenueMapsChange = new EventEmitter<any>();
    @Output('secondVenueMapsChange') public onSecondVenueMapsChange = new EventEmitter<any>();
    @Output('firstVenueImagesChange') public onFirstVenueImagesChange = new EventEmitter<any>();
    @Output('secondVenueImagesChange') public onSecondVenueImagesChange = new EventEmitter<any>();
    @Output('firstVenueDocumentsChange') public onFirstVenueDocumentsChange = new EventEmitter<any>();
    @Output('secondVenueDocumentsChange') public onSecondVenueDocumentsChange = new EventEmitter<any>();
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

    public get attachmentType() {
        return AttachmentType;
    }

    public ngOnInit(): void {
        this.initializeForm();
        this.loadCountries();

        this.refreshSubject.subscribe((event) => {
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

    public dateClass = (d: Date) => {
        const day = moment(d)
            .toDate()
            .getDay();
        return (day === 0 || day === 6) ? 'custom-date-class' : undefined;
    }

    public onDateChanged(event) {
        this.dateInvalid = true;
    }

    public hasError(controlName: string, errorName: string) {
        return this.projectDetailForm.controls[controlName].hasError(errorName);
    }

    public isTouched(controlName: string) {
        return this.projectDetailForm.controls[controlName].touched;
    }

    public isEmpty(controlName: string) {
        return !this.projectDetailForm.controls[controlName].value;
    }

    public resetFirstVenueMap(i: number){
        this.firstVenueMapNames.splice(i, 1);
        this.firstVenueMapBlobs.splice(i, 1);
        this.firstVenueMapSources.splice(i, 1);
        this.firstVenueMapPaths.splice(i, 1);
    }

    public resetSecondVenueMap(i: number){
        this.secondVenueMapNames.splice(i, 1);
        this.secondVenueMapBlobs.splice(i, 1);
        this.secondVenueMapSources.splice(i, 1);
        this.secondVenueMapPaths.splice(i, 1);
    }

    public resetFirstVenueImage(i: number){
        this.firstVenueImageNames.splice(i, 1);
        this.firstVenueImageBlobs.splice(i, 1);
        this.firstVenueImageSources.splice(i, 1);
        this.firstVenueImagePaths.splice(i, 1);
    }

    public resetSecondVenueImage(i: number){
        this.secondVenueImageNames.splice(i, 1);
        this.secondVenueImageBlobs.splice(i, 1);
        this.secondVenueImageSources.splice(i, 1);
        this.secondVenueImagePaths.splice(i, 1);
    }

    public resetFirstVenueDocument(i: number){
        this.firstVenueDocumentNames.splice(i, 1);
        this.firstVenueDocumentBlobs.splice(i, 1);
        this.firstVenueDocumentSources.splice(i, 1);
        this.firstVenueDocumentPaths.splice(i, 1);
    }

    public resetSecondVenueDocument(i: number){
        this.secondVenueDocumentNames.splice(i, 1);
        this.secondVenueDocumentBlobs.splice(i, 1);
        this.secondVenueDocumentSources.splice(i, 1);
        this.secondVenueDocumentPaths.splice(i, 1);
    }

    public onFirstMapDropped(files: any) {
        const file: File = files[0];
        this.firstMapUpdate(file);
    }

    public onFirstMapInserted(event) {
        const file = event.target.files[0];
        if (!file) {
            return;
        }
        this.firstMapUpdate(file);
    }

    public onSecondMapDropped(files: any) {
        const file: File = files[0];
        this.secondMapUpdate(file);
    }

    public onSecondMapInserted(event) {
        const file = event.target.files[0];
        if (!file) {
            return;
        }
        this.secondMapUpdate(file);
    }

    public onFirstImageDropped(files: any) {
        const file: File = files[0];
        this.firstImageUpdate(file);
    }

    public onFirstImageInserted(event) {
        const file = event.target.files[0];
        if (!file) {
            return;
        }
        this.firstImageUpdate(file);
    }

    public onSecondImageDropped(files: any) {
        const file: File = files[0];
        this.secondImageUpdate(file);
    }

    public onSecondImageInserted(event) {
        const file = event.target.files[0];
        if (!file) {
            return;
        }
        this.secondImageUpdate(file);
    }

    public onFirstDocumentDropped(files: any) {
        const file: File = files[0];
        this.firstDocumentUpdate(file);
    }

    public onFirstDocumentInserted(event) {
        const file = event.target.files[0];
        if (!file) {
            return;
        }
        this.firstDocumentUpdate(file);
    }

    public onSecondDocumentDropped(files: any) {
        const file: File = files[0];
        this.secondDocumentUpdate(file);
    }

    public onSecondDocumentInserted(event) {
        const file = event.target.files[0];
        if (!file) {
            return;
        }
        this.secondDocumentUpdate(file);
    }

    public toggleMaps(){
        this.viewMaps = !this.viewMaps;
    }

    public toggleImages(){
        this.viewImages = !this.viewImages;
    }

    public toggleDocuments(){
        this.viewDocuments = !this.viewDocuments;
    }

    public onLogoInserted(event) {
        const file = event.target.files[0];
        if (!file) {
            return;
        }
        const reader = new FileReader();
        reader.onload = () => {
            this.imageSrc = reader.result;
            this.imagesService.uploadImages([file])
                .subscribe((data) => {
                    this.projectDetailForm.controls.logoUploadId.patchValue(data.fileNames[file.name].replace(/^.*[\\\/]/, ''));
                }, () => {
                    this.imageSrc = this.defaultLogoPath;
                    this.notificationService.openErrorNotification('error.imageUpload');
                });
        };
        reader.readAsDataURL(file);
    }
 
    public download(blob: Blob, type: string, name: string): void {
        BlobManager.downloadFromBlob(blob, 'application/pdf', name);
    }

    public isAnyFirstVenueFile(): boolean{
        return this.firstVenueMapNames && (this.firstVenueMapNames.length > 0 || this.firstVenueImageNames.length > 0 || this.firstVenueDocumentNames.length > 0);   
    }

    public isAnySecondVenueFile(): boolean{
        return this.secondVenueMapNames && (this.secondVenueMapNames.length > 0 || this.secondVenueImageNames.length > 0 || this.secondVenueDocumentNames.length > 0);   
    }

    public downloadFirstVenueDocs(): void{
        for(var i=0; i < this.firstVenueMapNames.length; i++){
            BlobManager.downloadFromBlob(this.firstVenueMapBlobs[i], 'application/pdf', this.firstVenueMapNames[i]);
        }
        for(var i=0; i < this.firstVenueImageNames.length; i++){
            BlobManager.downloadFromBlob(this.firstVenueImageBlobs[i], 'image/*', this.firstVenueImageNames[i]);
        }
        for(var i=0; i < this.firstVenueDocumentNames.length; i++){
            BlobManager.downloadFromBlob(this.firstVenueDocumentBlobs[i], this.getContentTypeFromFileName(this.firstVenueDocumentNames[i]), this.firstVenueDocumentNames[i]);
        }
    }

    public downloadSecondVenueDocs(): void{
        for(var i=0; i < this.secondVenueMapNames.length; i++){
            BlobManager.downloadFromBlob(this.secondVenueMapBlobs[i], 'application/pdf', this.secondVenueMapNames[i]);
        }
        for(var i=0; i < this.secondVenueImageNames.length; i++){
            BlobManager.downloadFromBlob(this.secondVenueImageBlobs[i], 'image/*', this.secondVenueImageNames[i]);
        }
        for(var i=0; i < this.secondVenueDocumentNames.length; i++){
            BlobManager.downloadFromBlob(this.secondVenueDocumentBlobs[i], this.getContentTypeFromFileName(this.secondVenueDocumentNames[i]), this.secondVenueDocumentNames[i]);
        }
    }

    public openDialogByType(source: any, name: string): void {
        const type = this.getFileEnding(name);
        if(!this.isJpegJpgOrPdfFromName(name)){
            return;
        }
        if(type === 'pdf'){
            this.openDialog(source);
        } else {
            this.openImageDialog(source);
        }
    }

    public isJpegJpgOrPdfFromName(name: string){
        return ['jpg', 'jpeg', 'pdf'].includes(this.getFileEnding(name));
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

    /**
     * Emit data for wrapper form create or form edit component
     */
    private emitFormDataChangeEmitter(): void {
        if (this.projectDetailForm.invalid) {
            this.onFormDataChange.emit(null);
        } else {
            const actualValue = {
                ...this.projectDetailForm.value,
            };
            this.onFormDataChange.emit(actualValue);
        }
    }

    private emitFirstVenueMapsChangeEmitter(): void {
        const actualValue = {
            "sources": this.firstVenueMapSources,
            "names": this.firstVenueMapNames,
            "blobs": this.firstVenueMapBlobs,
            "paths": this.firstVenueMapPaths,
        };
        this.onFirstVenueMapsChange.emit(actualValue);
    }

    private emitSecondVenueMapsChangeEmitter(): void {
        const actualValue = {
            "sources": this.secondVenueMapSources,
            "names": this.secondVenueMapNames,
            "blobs": this.secondVenueMapBlobs,
            "paths": this.secondVenueMapPaths,
        };
        this.onSecondVenueMapsChange.emit(actualValue);
    }

    private emitFirstVenueImagesChangeEmitter(): void {
        const actualValue = {
            "sources": this.firstVenueImageSources,
            "names": this.firstVenueImageNames,
            "blobs": this.firstVenueImageBlobs,
            "paths": this.firstVenueImagePaths,
        };
        this.onFirstVenueImagesChange.emit(actualValue);
    }

    private emitSecondVenueImagesChangeEmitter(): void {
        const actualValue = {
            "sources": this.secondVenueImageSources,
            "names": this.secondVenueImageNames,
            "blobs": this.secondVenueImageBlobs,
            "paths": this.secondVenueImagePaths,
        };
        this.onSecondVenueImagesChange.emit(actualValue);
    }

    private emitFirstVenueDocumentsChangeEmitter(): void {
        const actualValue = {
            "sources": this.firstVenueDocumentSources,
            "names": this.firstVenueDocumentNames,
            "blobs": this.firstVenueDocumentBlobs,
            "paths": this.firstVenueDocumentPaths,
        };
        this.onFirstVenueDocumentsChange.emit(actualValue);
    }

    private emitSecondVenueDocumentsChangeEmitter(): void {
        const actualValue = {
            "sources": this.secondVenueDocumentSources,
            "names": this.secondVenueDocumentNames,
            "blobs": this.secondVenueDocumentBlobs,
            "paths": this.secondVenueDocumentPaths,
        };
        this.onSecondVenueDocumentsChange.emit(actualValue);
    }

    private loadCountries() {
        this.countriesLoading = true;
        this.businessAreaService.listCountries()
            .pipe(finalize(() => this.countriesLoading = false))
            .subscribe((data) => {
                this.countryList = data.content.filter((item) => item.state === 'VALID');
            }, () => {
                this.notificationService.openErrorNotification('error.api');
            });
    }

    private loadProjectDetail() {
        this.projectsService.getProjectByProjectId(this.projectEventService.instant.id)
            .subscribe((data) => {
                this.setFormWithDetailData(data);
            }, () => {
                this.notificationService.openErrorNotification('error.getProjectDetail');
            });
    }

    private setFormWithDetailData(projectDetail: ProjectDetail) {
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

        this.projectDetailForm.patchValue({
            name: projectDetail.name,
            year: projectDetail.year,
            status: projectDetail.state,
        });
        if (projectDetail.dateFrom) {
            this.projectDetailForm.controls.dateFrom.patchValue(projectDetail.dateFrom);
        }
        if (projectDetail.dateTo) {
            this.projectDetailForm.controls.dateTo.patchValue(projectDetail.dateTo);
        }
        if (projectDetail.description) {
            this.projectDetailForm.controls.description.patchValue(projectDetail.description);
        }
        if (projectDetail.logo) {
            this.projectDetailForm.controls.logoUploadId.patchValue(projectDetail.logo);
        }
        if (projectDetail.id) {
            this.projectDetailForm.controls.projectId.patchValue(projectDetail.id);
        }

        const firstCountryObject = projectDetail.projectVenues.find((projectVenue) => projectVenue.screenPosition === 1);
        this.setFormFromFirstCountry(firstCountryObject);
        const secondCountryObject = projectDetail.projectVenues.find((projectVenue) => projectVenue.screenPosition === 2);
        this.setFormFromSecondCountry(secondCountryObject);

        if (projectDetail.logo) {
            this.imagesService.getImage(projectDetail.logo)
                .subscribe((blob) => {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        this.imageSrc = reader.result;
                    };
                    reader.readAsDataURL(blob);
                }, () => {
                    this.notificationService.openErrorNotification('error.imageDownload');
                });
        }

        if (firstCountryObject && firstCountryObject.attachments.length > 0) {
            const firstVenueMaps = firstCountryObject.attachments.filter((attachment) => attachment.type === AttachmentType.Map);
            const firstVenueImages = firstCountryObject.attachments.filter((attachment) => attachment.type === AttachmentType.Image);
            const firstVenueDocuments = firstCountryObject.attachments.filter((attachment) => attachment.type === AttachmentType.Document);
        
            firstVenueMaps.forEach((attachment) => {
                this.attachmentService.getAttachment(attachment.filePath)
                    .subscribe((blob) => {
                        const reader = new FileReader();
                        reader.onload = () => {
                            this.firstVenueMapSources.unshift(reader.result);
                            this.firstVenueMapPaths.unshift(attachment.filePath);
                            this.firstVenueMapNames.unshift(attachment.fileName);
                            this.firstVenueMapBlobs.unshift(blob);
                        };
                        reader.readAsDataURL(blob);
                    }, () => {
                        this.notificationService.openErrorNotification('error.attachmentDownload');
                    });
            });

            firstVenueImages.forEach((attachment) => {
                this.imagesService.getImage(attachment.filePath)
                    .subscribe((blob) => {
                        const reader = new FileReader();
                        reader.onload = () => {
                            this.firstVenueImageSources.unshift(reader.result);
                            this.firstVenueImagePaths.unshift(attachment.filePath);
                            this.firstVenueImageNames.unshift(attachment.fileName);
                            this.firstVenueImageBlobs.unshift(blob);
                        };
                        reader.readAsDataURL(blob);
                    }, () => {
                        this.notificationService.openErrorNotification('error.attachmentDownload');
                    });
            });

            firstVenueDocuments.forEach((attachment) => {
                if(this.getFileEnding(attachment.filePath) === "jpeg" || this.getFileEnding(attachment.filePath) === "jpg"){
                    this.imagesService.getImage(attachment.filePath)
                    .subscribe((blob) => {
                        const reader = new FileReader();
                        reader.onload = () => {
                            // this.firstVenueDocumentSources.unshift( this.domSanitizer.bypassSecurityTrustUrl(reader.result as string));
                            this.firstVenueDocumentSources.unshift(reader.result);
                            this.firstVenueDocumentPaths.unshift(attachment.filePath);
                            this.firstVenueDocumentBlobs.unshift(blob);
                            this.firstVenueDocumentNames.unshift(attachment.fileName);
                        };
                        reader.readAsDataURL(blob);
                    }, () => {
                        this.notificationService.openErrorNotification('error.attachmentDownload');
                    });
                } else {
                    this.attachmentService.getAttachment(attachment.filePath)
                    .subscribe((blob) => {
                        const reader = new FileReader();
                        reader.onload = () => {
                            // this.firstVenueDocumentSources.unshift( this.domSanitizer.bypassSecurityTrustUrl(reader.result as string));
                            this.firstVenueDocumentSources.unshift(reader.result);
                            this.firstVenueDocumentPaths.unshift(attachment.filePath);
                            this.firstVenueDocumentBlobs.unshift(blob);
                            this.firstVenueDocumentNames.unshift(attachment.fileName);
                        };
                        reader.readAsDataURL(blob);
                    }, () => {
                        this.notificationService.openErrorNotification('error.attachmentDownload');
                    });
                }
                
            });

        } else if (!firstCountryObject || !(firstCountryObject.attachments.length > 0)) {
            this.firstVenueMapSources = [];
            this.firstVenueMapPaths = [];
            this.firstVenueImageSources = [];
            this.firstVenueImagePaths = [];
            this.firstVenueDocumentSources = [];
            this.firstVenueDocumentPaths = [];
        }

        if (secondCountryObject && secondCountryObject.attachments.length > 0) {
            const secondVenueMaps = secondCountryObject.attachments.filter((attachment) => attachment.type === AttachmentType.Map);
            const secondVenueImages = secondCountryObject.attachments.filter((attachment) => attachment.type === AttachmentType.Image);
            const secondVenueDocuments = secondCountryObject.attachments.filter((attachment) => attachment.type === AttachmentType.Document);
        
            secondVenueMaps.forEach((attachment) => {
                this.attachmentService.getAttachment(attachment.filePath)
                    .subscribe((blob) => {
                        const reader = new FileReader();
                        reader.onload = () => {
                            this.secondVenueMapSources.unshift(reader.result);
                            this.secondVenueMapPaths.unshift(attachment.filePath);
                            this.secondVenueMapNames.unshift(attachment.fileName);
                            this.secondVenueMapBlobs.unshift(blob);
                        };
                        reader.readAsDataURL(blob);
                    }, () => {
                        this.notificationService.openErrorNotification('error.attachmentDownload');
                    });
            });

            secondVenueImages.forEach((attachment) => {
                
                this.imagesService.getImage(attachment.filePath)
                    .subscribe((blob) => {
                        const reader = new FileReader();
                        reader.onload = () => {
                            this.secondVenueImageBlobs.unshift(blob);
                            this.secondVenueImageSources.unshift(reader.result);
                            this.secondVenueImagePaths.unshift(attachment.filePath);
                            this.secondVenueImageNames.unshift(attachment.fileName);
                        };
                        reader.readAsDataURL(blob);
                    }, () => {
                        this.notificationService.openErrorNotification('error.attachmentDownload');
                    });
            });

            secondVenueDocuments.forEach((attachment) => {
                
                if(this.getFileEnding(attachment.filePath) === "jpeg" || this.getFileEnding(attachment.filePath) === "jpg"){
                    this.imagesService.getImage(attachment.filePath)
                    .subscribe((blob) => {
                        const reader = new FileReader();
                        reader.onload = () => {
                            // this.secondVenueDocumentSources.unshift( this.domSanitizer.bypassSecurityTrustUrl(reader.result as string));
                            this.secondVenueDocumentSources.unshift(reader.result);
                            this.secondVenueDocumentPaths.unshift(attachment.filePath);
                            this.secondVenueDocumentBlobs.unshift(blob);
                            this.secondVenueDocumentNames.unshift(attachment.fileName);
                        };
                        reader.readAsDataURL(blob);
                    }, () => {
                        this.notificationService.openErrorNotification('error.attachmentDownload');
                    });
                } else {
                    this.attachmentService.getAttachment(attachment.filePath)
                    .subscribe((blob) => {
                        const reader = new FileReader();
                        reader.onload = () => {
                            // this.secondVenueDocumentSources.unshift( this.domSanitizer.bypassSecurityTrustUrl(reader.result as string));
                            this.secondVenueDocumentSources.unshift(reader.result);
                            this.secondVenueDocumentPaths.unshift(attachment.filePath);
                            this.secondVenueDocumentBlobs.unshift(blob);
                            this.secondVenueDocumentNames.unshift(attachment.fileName);
                        };
                        reader.readAsDataURL(blob);
                    }, () => {
                        this.notificationService.openErrorNotification('error.attachmentDownload');
                    });
                }
            });

        } else if (!secondCountryObject || !(secondCountryObject.attachments.length > 0)) {
            this.secondVenueMapSources = [];
            this.secondVenueMapPaths = [];
            this.secondVenueImageSources = [];
            this.secondVenueImagePaths = [];
            this.secondVenueDocumentSources = [];
            this.secondVenueDocumentPaths = [];
        }
        
    }

    // TODO: add type
    private firstMapUpdate(file: any) {
        const reader = new FileReader();
        reader.onload = () => {
            this.attachmentService.uploadAttachment([file])
                .subscribe((data) => {
                    this.firstVenueMapNames.unshift(file.name);
                    this.firstVenueMapSources.unshift(reader.result);
                    this.firstVenueMapPaths.unshift(data.fileNames[file.name]);
                }, () => {
                    this.notificationService.openErrorNotification('error.attachmentUpload');
                });
        };
        reader.readAsDataURL(file);
    }

    private secondMapUpdate(file: any) {
        const reader = new FileReader();
        reader.onload = () => {
            this.attachmentService.uploadAttachment([file])
                .subscribe((data) => {
                    this.secondVenueMapNames.unshift(file.name);
                    this.secondVenueMapSources.unshift(reader.result);
                    this.secondVenueMapPaths.unshift(data.fileNames[file.name]);
                }, () => {
                    this.notificationService.openErrorNotification('error.attachmentUpload');
                });
        };
        reader.readAsDataURL(file);
    }

    private firstImageUpdate(file: any) {
        const reader = new FileReader();
        reader.onload = () => {
            this.imagesService.uploadImages([file])
                .subscribe((data) => {
                    this.firstVenueImageNames.unshift(file.name);
                    this.firstVenueImageSources.unshift(reader.result);
                    this.firstVenueImagePaths.unshift(data.fileNames[file.name]);
                    this.emitFirstVenueImagesChangeEmitter();
                }, () => {
                    this.notificationService.openErrorNotification('error.attachmentUpload');
                });
        };
        reader.readAsDataURL(file);
    }

    private secondImageUpdate(file: any) {
        const reader = new FileReader();
        reader.onload = () => {
            this.imagesService.uploadImages([file])
                .subscribe((data) => {
                    this.secondVenueImageNames.unshift(file.name);
                    this.secondVenueImageSources.unshift(reader.result);
                    this.secondVenueImagePaths.unshift(data.fileNames[file.name]);
                }, () => {
                    this.notificationService.openErrorNotification('error.attachmentUpload');
                });
        };
        reader.readAsDataURL(file);
    }

    private firstDocumentUpdate(file: any) {
        const reader = new FileReader();
        reader.onload = () => {
            if (this.fileIsImage(file)) {
                this.imagesService.uploadImages([file])
                .subscribe((data) => {
                    this.firstVenueDocumentNames.unshift(file.name);
                    this.firstVenueDocumentSources.unshift(reader.result);
                    this.firstVenueDocumentPaths.unshift(data.fileNames[file.name]);
                }, () => {
                    this.notificationService.openErrorNotification('error.attachmentUpload');
                });
            } else {
                this.attachmentService.uploadAttachment([file])
                .subscribe((data) => {
                    this.firstVenueDocumentNames.unshift(file.name);
                    this.firstVenueDocumentSources.unshift(reader.result);
                    this.firstVenueDocumentPaths.unshift(data.fileNames[file.name]);
                }, () => {
                    this.notificationService.openErrorNotification('error.attachmentUpload');
                });
            }
        };
        reader.readAsDataURL(file);
    }

    private secondDocumentUpdate(file: any) {
        const reader = new FileReader();
        reader.onload = () => {
            if (this.fileIsImage(file)) {
                this.imagesService.uploadImages([file])
                .subscribe((data) => {
                    this.secondVenueDocumentNames.unshift(file.name);
                    this.secondVenueDocumentSources.unshift(reader.result);
                    this.secondVenueDocumentPaths.unshift(data.fileNames[file.name]);
                }, () => {
                    this.notificationService.openErrorNotification('error.attachmentUpload');
                });
            } else {
                this.attachmentService.uploadAttachment([file])
                .subscribe((data) => {
                    this.secondVenueDocumentNames.unshift(file.name);
                    this.secondVenueDocumentSources.unshift(reader.result);
                    this.secondVenueDocumentPaths.unshift(data.fileNames[file.name]);
                }, () => {
                    this.notificationService.openErrorNotification('error.attachmentUpload');
                });
            }
        };
        reader.readAsDataURL(file);
    }

    private setFormFromFirstCountry(firstCountryObject: any) {
        if (firstCountryObject) {
            this.projectDetailForm.controls.firstCountry.patchValue(firstCountryObject.clCountry.id);
            if (firstCountryObject.cityName) {
                this.projectDetailForm.controls.firstVenue.patchValue(firstCountryObject.cityName);
                this.projectDetailForm.controls.oldFirstVenue.patchValue(firstCountryObject.cityName);
                if (firstCountryObject.attachment && firstCountryObject.attachment.filePath) {
                    const attachments = [];
                    const attachmentsUpload = [];
                    if (firstCountryObject.attachment instanceof Array) {
                        attachments.concat(firstCountryObject.attachment);
                        firstCountryObject.attachment.forEach((item) => {
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
            }
        }
    }

    private setFormFromSecondCountry(secondCountryObject: any) {
        if (secondCountryObject) {
            this.projectDetailForm.controls.secondCountry.patchValue(secondCountryObject.clCountry.id);
            if (secondCountryObject.cityName) {
                this.projectDetailForm.controls.oldSecondVenue.patchValue(secondCountryObject.cityName);
                this.projectDetailForm.controls.secondVenue.patchValue(secondCountryObject.cityName);
                if (secondCountryObject.attachment && secondCountryObject.attachment.filePath) {
                    const attachments = [];
                    const attachmentsUpload = [];
                    if (secondCountryObject.attachment instanceof Array) {
                        attachments.concat(secondCountryObject.attachment);
                        secondCountryObject.attachment.forEach((item) => {
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
            }
        }
    }

    private fileIsImage(file: any): boolean {
        return file.type.startsWith("image");
    }

    private firstCountryEmptyWhenFirstVenue() {
        return (group: FormGroup): {[key: string]: any} => {
            const firstCountryEmptyWhenFirstVenue = this.editMode && this.projectDetailForm.controls.firstVenue.value && !this.projectDetailForm.controls.firstCountry.value;
            return firstCountryEmptyWhenFirstVenue ? {firstCountryEmptyWhenSecondCountry: firstCountryEmptyWhenFirstVenue} : null;

        };
    }

    private secondCountryEmptyWhenSecondVenue() {
        return (group: FormGroup): {[key: string]: any} => {
            const secondCountryEmptyWhenSecondVenue = this.editMode && this.projectDetailForm.controls.secondVenue.value && !this.projectDetailForm.controls.secondCountry.value;
            return secondCountryEmptyWhenSecondVenue ? {secondCountryEmptyWhenSecondVenue} : null;

        };
    }

    private firstCountryEmptyWhenSecondCountry() {
        return (group: FormGroup): {[key: string]: any} => {
            const firstCountryEmptyWhenSecondCountry = this.editMode && this.projectDetailForm.controls.secondCountry.value && !this.projectDetailForm.controls.firstCountry.value;
            return firstCountryEmptyWhenSecondCountry ? {firstCountryEmptyWhenSecondCountry} : null;

        };
    }

    private firstVenueEmptyWhenFirstMap() {
        return (group: FormGroup): {[key: string]: any} => {
            const firstVenueEmptyWhenFirstMap = this.editMode && this.projectDetailForm.controls.firstMapUpload.value.id && !this.projectDetailForm.controls.firstVenue.value;
            return firstVenueEmptyWhenFirstMap ? {firstVenueEmptyWhenFirstMap} : null;

        };
    }

    private secondVenueEmptyWhenSecondMap() {
        return (group: FormGroup): {[key: string]: any} => {
            const secondVenueEmptyWhenSecondMap = this.editMode && this.projectDetailForm.controls.secondMapUpload.value && !this.projectDetailForm.controls.secondVenue.value;
            return secondVenueEmptyWhenSecondMap ? {secondVenueEmptyWhenSecondMap} : null;

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
                this.firstVenueEmptyWhenFirstMap(),
                this.secondVenueEmptyWhenSecondMap(),
            ]
        });

    }

    public getFileEnding(filePath: string): string {
        return filePath.substr(filePath.lastIndexOf(".") + 1).toLowerCase();
    }

    accept=".zip,image/jpeg"
                                  

    private getContentTypeFromFileName(fileName: string): string {
        switch(this.getFileEnding(fileName)) {
            case "pdf": {
                return "application/pdf";
            }
            case "jpeg": {
                return "image/jpeg";
            }
            case "txt": {
                return "text/plain";
            }
            case "rtf": {
                return ".rtf";
            }
            case "csv": {
                return ".csv";
            }
            case "doc": {
                return ".doc";
            }
            case "docx": {
                return ".docx";
            }
            case "xls": {
                return ".application/vnd.ms-excel";
            }
            case "xlsx": {
                return ".application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
            }
            case "zip": {
                return ".zip";
            }
            default:{
                return "*";
            }     
        }
    }

}
