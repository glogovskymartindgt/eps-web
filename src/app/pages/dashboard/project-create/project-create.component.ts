import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { Router } from '@angular/router';
import * as _moment from 'moment';
import { finalize } from 'rxjs/operators';
import { enterLeave, fadeEnterLeave } from '../../../shared/hazlenut/hazelnut-common/animations';
import { Regex } from '../../../shared/hazlenut/hazelnut-common/regex/regex';
import { BusinessAreaService } from '../../../shared/services/data/business-area.service';
import { ImagesService } from '../../../shared/services/data/images.service';
import { NotificationService } from '../../../shared/services/notification.service';

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
    selector: 'project-create',
    templateUrl: './project-create.component.html',
    styleUrls: ['./project-create.component.scss'],
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
export class ProjectCreateComponent implements OnInit {
    public defaultLogoPath = 'assets/img/iihf-logo-without-text-transparent.png';
    public projectDetailForm: FormGroup;
    public yearPattern = Regex.yearPattern;
    public numericPattern = Regex.numericPattern;
    public notOnlyWhiteCharactersPattern = Regex.notOnlyWhiteCharactersPattern;
    public dateInvalid = false;
    public imageSrc: any = this.defaultLogoPath;
    public dateInvalidClosed = false;
    public countryList = [];
    public countriesLoading = false;

    public constructor(private readonly imagesService: ImagesService,
                       private readonly notificationService: NotificationService,
                       private readonly router: Router,
                       private readonly formBuilder: FormBuilder,
                       private readonly businessAreaService: BusinessAreaService) {
    }

    public ngOnInit(): void {
        this.initializeForm();
        this.loadCountries();
    }

    public onSave(): void {
        // + add roles
        console.log(this.projectDetailForm.value);
    }

    public onCancel(): void {
        this.router.navigate(['dashboard/list']);
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

    public hasError(controlName: string, errorName: string) {
        return this.projectDetailForm.controls[controlName].hasError(errorName);
    }

    public isTouched(controlName: string) {
        return this.projectDetailForm.controls[controlName].touched;
    }

    public isEmpty(controlName: string) {
        return !this.projectDetailForm.controls[controlName].value as boolean;
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

    private initializeForm(): void {
        this.projectDetailForm = this.formBuilder.group({
            logo: [''],
            name: [''],
            year: [''],
            dateFrom: [''],
            dateTo: [''],
            firstCountry: [''],
            secondCountry: [''],
            firstVenue: ['', ],
            secondVenue: [''],
            logoUploadId: [''],
            description: [''],
        });
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

}
