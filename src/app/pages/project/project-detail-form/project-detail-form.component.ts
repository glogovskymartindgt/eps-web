import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import * as _moment from 'moment';
import { PdfViewerComponent } from 'ng2-pdf-viewer';
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
import { MY_FORMATS } from '../../tasks/task-form/task-form.component';

const moment = _moment;

export const CUSTOM_FORMATS = {
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
            useValue: MY_FORMATS
        },
    ],
})
export class ProjectDetailFormComponent implements OnInit, OnChanges {
    @Input('editMode') public editMode: boolean;
    @Output('formDataChange') public onFormDataChange = new EventEmitter<any>();
    @ViewChild('secondMapPdf') public secondMapPdf: PdfViewerComponent;
    public projectDetailForm: FormGroup;
    public numericPattern = Regex.numericPattern;
    public dateInvalid = false;

    public firstMapSrc: any = '';
    public firstMapPdfName: string;
    public firstMapBlob: any;

    public secondMapSrc: any = '';
    public secondMapPdfName: string;
    public secondMapBlob: any;

    public imageSrc: any = 'assets/img/iihf-logo-without-text-transparent.png';
    public dateInvalidClosed = false;
    public countryList = [];
    public countriesLoading = false;
    public public;

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
        this.loadCountries();
        this.loadProjectDetail();
        this.projectDetailForm = this.formBuilder.group({
            logo: [''],
            name: [''],
            year: [''],
            status: [''],
            dateFrom: [''],
            dateTo: [''],
            firstCountry: [''],
            secondCountry: [''],
            firstVenue: [''],
            secondVenue: [''],
            firstMap: [''],
            secondMap: [''],
            description: [
                {
                    value: '',
                    disabled: true
                }
            ],
        });
        this.projectDetailForm.disable();

        // Emit value changes to parent component
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
            this.projectDetailForm.controls.description.disable();
        }
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
            this.secondMapSrc = null;
        }
    }

    public onFirstMapDropped(files: any) {
        const file: File = files[0];

        const reader = new FileReader();
        reader.onload = (e) => {
            this.firstMapSrc = reader.result;
        };
        reader.readAsDataURL(file);
    }

    public onFirstMapInserted(event) {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            this.firstMapSrc = reader.result;
        };
        reader.readAsDataURL(file);
    }

    public onSecondMapDropped(files: any) {
        const file: File = files[0];

        const reader = new FileReader();
        reader.onload = (e) => {
            this.secondMapSrc = reader.result;
        };
        reader.readAsDataURL(file);
    }

    public onSecondMapInserted(event) {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            this.secondMapSrc = reader.result;
        };
        reader.readAsDataURL(file);
    }

    public onLogoInserted(event) {
        const file = event.target.files[0];
        if (!file) {
            return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            this.imageSrc = reader.result;
        };
        reader.readAsDataURL(file);
    }

    public downloadFirst(): void {
        let link: HTMLAnchorElement;
        link = document.createElement('a');
        link.setAttribute('class', 'hide');
        link.setAttribute('href', '');
        document.body.appendChild(link);
        link.href = URL.createObjectURL(new Blob([this.firstMapBlob], {type: 'application/pdf'}));
        link.download = this.firstMapPdfName;
        link.click();
        document.body.removeChild(link);
    }

    public downloadSecond(): void {
        let link: HTMLAnchorElement;
        link = document.createElement('a');
        link.setAttribute('class', 'hide');
        link.setAttribute('href', '');
        document.body.appendChild(link);
        link.href = URL.createObjectURL(new Blob([this.secondMapBlob], {type: 'application/pdf'}));
        link.download = this.secondMapPdfName;
        link.click();
        document.body.removeChild(link);
    }

    public openDialog(source: string): void {
        const dialogRef = this.matDialog.open(PdfDialogComponent, {
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
        const firstCountryObject = projectDetail.projectVenue.find((projectVenue) => projectVenue.screenPosition === 1);
        if (firstCountryObject) {
            this.projectDetailForm.controls.firstCountry.patchValue(firstCountryObject.clCountry.id);
            if (firstCountryObject.cityName) {
                this.projectDetailForm.controls.firstVenue.patchValue(firstCountryObject.cityName);
            }
        }
        const secondCountryObject = projectDetail.projectVenue.find((projectVenue) => projectVenue.screenPosition === 2);
        if (secondCountryObject) {
            this.projectDetailForm.controls.secondCountry.patchValue(secondCountryObject.clCountry.id);
            if (secondCountryObject.cityName) {
                this.projectDetailForm.controls.secondVenue.patchValue(secondCountryObject.cityName);
            }
        }

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

        if (firstCountryObject.attachment) {
            this.firstMapPdfName = firstCountryObject.attachment.fileName;
            this.attachmentService.getAttachment(firstCountryObject.attachment.filePath)
                .subscribe((blob) => {

                    this.firstMapBlob = blob;

                    const reader = new FileReader();
                    reader.onload = (e) => {
                        this.firstMapSrc = reader.result;
                    };
                    reader.readAsDataURL(blob);
                }, () => {
                    this.notificationService.openErrorNotification('error.attachmentDownload');
                });
        }

        if (secondCountryObject.attachment) {
            this.secondMapPdfName = secondCountryObject.attachment.fileName;
            this.attachmentService.getAttachment(secondCountryObject.attachment.filePath)
                .subscribe((blob) => {

                    this.secondMapBlob = blob;

                    const reader = new FileReader();
                    reader.onload = (e) => {
                        this.secondMapSrc = reader.result;
                    };
                    reader.readAsDataURL(blob);
                }, () => {
                    this.notificationService.openErrorNotification('error.attachmentDownload');
                });
        }

    }

}
