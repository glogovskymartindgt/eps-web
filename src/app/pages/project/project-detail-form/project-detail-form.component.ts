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
import { enterLeave, fadeEnterLeave } from '../../../shared/hazlenut/hazelnut-common/animations';
import { Regex } from '../../../shared/hazlenut/hazelnut-common/regex/regex';
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
    selector: 'project-detail-form',
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
    @Input('editMode') public editMode: boolean;
    @Input('refreshSubject') public refreshSubject: Subject<any>;
    @Output('formDataChange') public onFormDataChange = new EventEmitter<any>();
    public defaultLogoPath = 'assets/img/iihf-logo-without-text-transparent.png';

    public projectDetailForm: FormGroup;
    public yearPattern = Regex.yearPattern;
    public numericPattern = Regex.numericPattern;
    public dateInvalid = false;

    public firstMapSrc: any = '';
    public firstMapPdfName: string;
    public firstMapBlob: any;

    public secondMapSrc: any = '';
    public secondMapPdfName: string;
    public secondMapBlob: any;

    public imageSrc: any = this.defaultLogoPath;
    public dateInvalidClosed = false;
    public countryList = [];
    public countriesLoading = false;

    public notOnlyWhiteCharactersPattern = Regex.notOnlyWhiteCharactersPattern;

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

    public onDateChangedClosed(event) {
        this.dateInvalidClosed = true;
    }

    public hasError(controlName: string, errorName: string) {
        return this.projectDetailForm.controls[controlName].hasError(errorName);
    }

    public isTouched(controlName: string) {
        return this.projectDetailForm.controls[controlName].touched;
    }

    public isEmpty(controlName: string) {
        return !this.projectDetailForm.controls[controlName].value as boolean;
    }

    public resetValue(controlName: string) {

        this.projectDetailForm.controls[controlName].reset();
        if (controlName === 'secondMap') {
            this.secondMapPdfName = null;
            this.secondMapBlob = null;
            this.secondMapSrc = null;
            this.projectDetailForm.controls.secondMapUploadId.reset();
        } else {
            this.firstMapPdfName = null;
            this.firstMapBlob = null;
            this.firstMapSrc = null;
            this.projectDetailForm.controls.firstMapUploadId.reset();
        }
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

    public downloadFirst(): void {
        BlobManager.downloadFromBlob(this.firstMapBlob, 'application/pdf', this.firstMapPdfName);
    }

    public downloadSecond(): void {
        BlobManager.downloadFromBlob(this.secondMapBlob, 'application/pdf', this.secondMapPdfName);
    }

    public openDialog(source: string): void {
        this.matDialog.open(PdfDialogComponent, {
            maxHeight: '80vh',
            minHeight: '80vh',
            maxWidth: '80vw',
            minWidth: '80vw',
            data: {
                source
            }
        });
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
        this.firstMapSrc = null;
        this.firstMapBlob = null;
        this.firstMapPdfName = null;

        this.secondMapSrc = null;
        this.secondMapBlob = null;
        this.secondMapPdfName = null;

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

        if (firstCountryObject && firstCountryObject.attachment) {
            this.firstMapPdfName = firstCountryObject.attachment.fileName;
            this.attachmentService.getAttachment(firstCountryObject.attachment.filePath)
                .subscribe((blob) => {

                    this.firstMapBlob = blob;

                    const reader = new FileReader();
                    reader.onload = () => {
                        this.firstMapSrc = reader.result;
                    };
                    reader.readAsDataURL(blob);
                }, () => {
                    this.notificationService.openErrorNotification('error.attachmentDownload');
                });
        } else if (!firstCountryObject || !firstCountryObject.attachment) {
            this.firstMapSrc = null;
        }

        if (secondCountryObject && secondCountryObject.attachment) {
            this.secondMapPdfName = secondCountryObject.attachment.fileName;
            this.attachmentService.getAttachment(secondCountryObject.attachment.filePath)
                .subscribe((blob) => {

                    this.secondMapBlob = blob;

                    const reader = new FileReader();
                    reader.onload = () => {
                        this.secondMapSrc = reader.result;
                    };
                    reader.readAsDataURL(blob);
                }, () => {
                    this.notificationService.openErrorNotification('error.attachmentDownload');
                });
        } else if (!secondCountryObject || !secondCountryObject.attachment) {
            this.secondMapSrc = null;
        }

    }

    // TODO: add type
    private firstMapUpdate(file: any) {
        const reader = new FileReader();
        this.firstMapPdfName = file.name;
        reader.onload = () => {
            this.firstMapSrc = reader.result;
            this.attachmentService.uploadAttachment([file])
                .subscribe((data) => {
                    this.projectDetailForm.controls.firstMapUploadId.patchValue(data.fileNames[file.name]);
                    this.projectDetailForm.controls.firstMapUploadName.patchValue(file.name);
                }, () => {
                    this.firstMapSrc = null;
                    this.firstMapBlob = null;
                    this.firstMapPdfName = null;
                    this.notificationService.openErrorNotification('error.attachmentUpload');
                });
        };
        reader.readAsDataURL(file);
    }

    private secondMapUpdate(file: any) {
        const reader = new FileReader();
        this.secondMapPdfName = file.name;
        reader.onload = () => {
            this.secondMapSrc = reader.result;
            this.attachmentService.uploadAttachment([file])
                .subscribe((data) => {
                    this.projectDetailForm.controls.secondMapUploadId.patchValue(data.fileNames[file.name]);
                    this.projectDetailForm.controls.secondMapUploadName.patchValue(file.name);
                }, () => {
                    this.secondMapSrc = null;
                    this.secondMapBlob = null;
                    this.secondMapPdfName = null;
                    this.notificationService.openErrorNotification('error.attachmentUpload');
                });
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
                    this.projectDetailForm.controls.firstMapUploadId.patchValue(firstCountryObject.attachment.filePath);
                    this.projectDetailForm.controls.firstMapUploadName.patchValue(firstCountryObject.attachment.fileName);
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
                    this.projectDetailForm.controls.secondMapUploadId.patchValue(secondCountryObject.attachment.filePath);
                    this.projectDetailForm.controls.secondMapUploadName.patchValue(secondCountryObject.attachment.fileName);
                }
            }
        }
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
            const firstVenueEmptyWhenFirstMap = this.editMode && this.projectDetailForm.controls.firstMapUploadId.value && !this.projectDetailForm.controls.firstVenue.value;
            return firstVenueEmptyWhenFirstMap ? {firstVenueEmptyWhenFirstMap} : null;

        };
    }

    private secondVenueEmptyWhenSecondMap() {
        return (group: FormGroup): {[key: string]: any} => {
            const secondVenueEmptyWhenSecondMap = this.editMode && this.projectDetailForm.controls.secondMapUploadId.value && !this.projectDetailForm.controls.secondVenue.value;
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
            firstVenue: ['', ],
            oldSecondVenue: [''],
            secondVenue: [''],
            firstMap: [''],
            secondMap: [''],
            logoUploadId: [''],
            firstMapUploadId: [''],
            firstMapUploadName: [''],
            secondMapUploadId: [''],
            secondMapUploadName: [''],
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

}
