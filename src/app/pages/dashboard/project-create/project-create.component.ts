import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { Router } from '@angular/router';
import * as _moment from 'moment';
import { finalize } from 'rxjs/operators';
import { Role } from '../../../shared/enums/role.enum';
import { enterLeave, fadeEnterLeave } from '../../../shared/hazelnut/hazelnut-common/animations';
import { BrowseResponse } from '../../../shared/hazelnut/hazelnut-common/models';
import { Regex } from '../../../shared/hazelnut/hazelnut-common/regex/regex';
import { Country } from '../../../shared/models/country.model';
import { AuthService } from '../../../shared/services/auth.service';
import { BusinessAreaService } from '../../../shared/services/data/business-area.service';
import { ImagesService } from '../../../shared/services/data/images.service';
import { ProjectsService } from '../../../shared/services/data/projects.service';
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

enum FormControlNames {
    PROJECT_TYPE= 'projectType',
}

@Component({
    selector: 'iihf-project-create',
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
    public projectTypeControl: FormControl;
    public yearPattern = Regex.yearPattern;
    public numericPattern = Regex.numericPattern;
    public notOnlyWhiteCharactersPattern = Regex.notOnlyWhiteCharactersPattern;
    public dateInvalid = false;
    public imageSrc: any = this.defaultLogoPath;
    public countryList = [];
    public countriesLoading = false;
    public readonly formControlName: typeof FormControlNames = FormControlNames;

    public constructor(private readonly imagesService: ImagesService,
                       private readonly notificationService: NotificationService,
                       private readonly router: Router,
                       private readonly formBuilder: FormBuilder,
                       private readonly businessAreaService: BusinessAreaService,
                       private readonly authService: AuthService,
                       private readonly projectsService: ProjectsService) {
    }

    public ngOnInit(): void {
        this.initializeForm();
        this.loadCountries();
        console.log('empty form: ', this.projectDetailForm.value)
    }

    public onSave(): void {
        this.projectsService.createProject(this.transformProjectToApiObject())
            .subscribe((): void => {
                this.notificationService.openSuccessNotification('success.add');
                this.router.navigate(['dashboard/list']);
            }, (): void => {
                this.notificationService.openErrorNotification('error.add');
            });
    }

    public onCancel(): void {
        this.router.navigate(['dashboard/list']);
    }

    public onLogoInserted(event): void {
        const file = event.target.files[0];
        if (!file) {
            return;
        }
        const reader = new FileReader();
        reader.onload = (): void => {
            this.imageSrc = reader.result;
            this.imagesService.uploadImages([file])
                .subscribe((data: any): void => {
                    this.projectDetailForm.controls.logoUploadId.patchValue(data.fileNames[file.name].replace(/^.*[\\\/]/, ''));
                }, (): void => {
                    this.imageSrc = this.defaultLogoPath;
                    this.notificationService.openErrorNotification('error.imageUpload');
                });
        };
        reader.readAsDataURL(file);
    }

    public dateClass = (date: Date): string | undefined => {
        const daysInWeekMinusOne = 6;
        const day = moment(date)
            .toDate()
            .getDay();

        return (day === 0 || day === daysInWeekMinusOne) ? 'custom-date-class' : undefined;
    }

    public onDateChanged(event): void {
        this.dateInvalid = true;
    }

    public hasRoleUploadImage(): boolean {
        return this.authService.hasRole(Role.RoleUploadImage);
    }

    public trackCountryById(index: number, country: Country): number {
        return country.id;
    }

    private transformProjectToApiObject(): any {
        console.log('transforming project to api object:', this.projectDetailForm.value )
        const formObject = this.projectDetailForm.value;
        const apiObject: any = {
            name: formObject.name,
            year: formObject.year,
            clProjectType: {id: formObject[FormControlNames.PROJECT_TYPE]},
        };
        if (formObject.dateFrom) {
            apiObject.dateFrom = formObject.dateFrom;
        }
        if (formObject.dateTo) {
            apiObject.dateTo = formObject.dateTo;
        }
        if (formObject.logoUploadId) {
            apiObject.logo = formObject.logoUploadId;
        }
        if (formObject.firstCountry || formObject.secondCountry) {
            apiObject.projectVenues = [];
        }
        if (formObject.firstCountry) {
            apiObject.projectVenues.push(this.createVenueObject(formObject, 1));
        }
        if (formObject.secondCountry) {
            const screenPosition = 2;
            apiObject.projectVenues.push(this.createVenueObject(formObject, screenPosition));
        }
        if (formObject.thirdCountry) {
            const screenPosition = 3;
            apiObject.projectVenues.push(this.createVenueObject(formObject, screenPosition));
        }
        if (formObject.description) {
            apiObject.description = formObject.description;
        }

        console.log('project venues: ', apiObject.projectVenues)

        return apiObject;
    }

    private createVenueObject(formObject: any, screenPosition: number): any {
        const venueObject: any = {};
        venueObject.screenPosition = screenPosition;
        switch (screenPosition) {
            case 1 :
                venueObject.clCountry = {id: formObject.firstCountry};
            case 2 :
                venueObject.clCountry = {id: formObject.secondCountry};
            case 3 : 
                venueObject.clCountry = {id: formObject.thirdCountry};
        }
        if (formObject.secondVenue) {
            venueObject.cityName = screenPosition === 1 ? formObject.firstVenue : formObject.secondVenue;
        }
        if (formObject.thirdVenue){
            venueObject.cityName = formObject.thirdVenue
        }
        console.log('create venue object: ', venueObject.clCountry)

        return venueObject;
    }

    private initializeForm(): void {
        this.projectDetailForm = this.formBuilder.group({
            logo: [''],
            name: [''],
            [FormControlNames.PROJECT_TYPE]: [''],
            year: [''],
            dateFrom: [''],
            dateTo: [''],
            firstCountry: [''],
            secondCountry: [''],
            thirdCountry: [''],
            firstVenue: ['', ],
            secondVenue: [''],
            thirdVenue: [''],
            logoUploadId: [''],
            description: [''],
        }, {
            validator: [
                this.firstCountryEmptyWhenFirstVenue(),
                this.secondCountryEmptyWhenSecondVenue(),
                this.firstCountryEmptyWhenSecondCountry(),
                this.firstCountryEmptyWhenThirdCountry(),
            ]
        });

        this.projectTypeControl = this.projectDetailForm.get(FormControlNames.PROJECT_TYPE) as FormControl;
    }

    private firstCountryEmptyWhenFirstVenue(): any {
        return (group: FormGroup): {[key: string]: any} => {
            let firstCountryEmptyWhenFirstVenue;
            if (this.projectDetailForm) {
                firstCountryEmptyWhenFirstVenue = this.projectDetailForm.controls.firstVenue.value && !this.projectDetailForm.controls.firstCountry.value;
            }

            return firstCountryEmptyWhenFirstVenue ? {firstCountryEmptyWhenSecondCountry: firstCountryEmptyWhenFirstVenue} : null;

        };
    }

    private secondCountryEmptyWhenSecondVenue(): any {
        return (group: FormGroup): {[key: string]: any} => {
            let secondCountryEmptyWhenSecondVenue;
            if (this.projectDetailForm) {
                secondCountryEmptyWhenSecondVenue = this.projectDetailForm.controls.secondVenue.value && !this.projectDetailForm.controls.secondCountry.value;
            }

            return secondCountryEmptyWhenSecondVenue ? {secondCountryEmptyWhenSecondVenue} : null;

        };
    }

    private firstCountryEmptyWhenSecondCountry(): any {
        return (group: FormGroup): {[key: string]: any} => {
            let firstCountryEmptyWhenSecondCountry;
            if (this.projectDetailForm) {
                firstCountryEmptyWhenSecondCountry = this.projectDetailForm.controls.secondCountry.value && !this.projectDetailForm.controls.firstCountry.value;
            }

            return firstCountryEmptyWhenSecondCountry ? {firstCountryEmptyWhenSecondCountry} : null;

        };
    }

    private firstCountryEmptyWhenThirdCountry(): any {
        return (group: FormGroup): {[key: string]: any} => {
            let firstCountryEmptyWhenThirdCountry;
            if (this.projectDetailForm) {
                firstCountryEmptyWhenThirdCountry = this.projectDetailForm.controls.thirdCountry.value && !this.projectDetailForm.controls.firstCountry.value;
            }

            return firstCountryEmptyWhenThirdCountry ? {firstCountryEmptyWhenThirdCountry} : null;

        };
    }

    private loadCountries(): any {
        this.countriesLoading = true;
        this.businessAreaService.listCountries()
            .pipe(finalize((): any => this.countriesLoading = false))
            .subscribe((data: BrowseResponse<Country>): void => {
                this.countryList = data.content.filter((item: Country): any => item.state === 'VALID');
            }, (): void => {
                this.notificationService.openErrorNotification('error.api');
            });
    }
}
