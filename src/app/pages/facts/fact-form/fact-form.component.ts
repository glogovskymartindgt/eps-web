import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { finalize } from 'rxjs/operators';
import { enterLeaveSmooth } from '../../../shared/hazlenut/hazelnut-common/animations';
import { Regex } from '../../../shared/hazlenut/hazelnut-common/regex/regex';
import { Category } from '../../../shared/interfaces/category.interface';
import { SubCategory } from '../../../shared/interfaces/subcategory.interface';
import { ThousandDelimiterPipe } from '../../../shared/pipes/thousand-delimiter.pipe';
import { BusinessAreaService } from '../../../shared/services/data/business-area.service';
import { FactService } from '../../../shared/services/data/fact.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { ProjectEventService } from '../../../shared/services/storage/project-event.service';

@Component({
    selector: 'fact-form',
    templateUrl: './fact-form.component.html',
    styleUrls: ['./fact-form.component.scss'],
    animations: [enterLeaveSmooth]
})

/**
 * Fact form component for multiple usage: edit | create | detail
 */ export class FactFormComponent implements OnInit {
    @Output('formDataChange') public onFormDataChange = new EventEmitter<any>();
    // Regex pattern for number with two decimal places
    public decimalPattern = Regex.decimalPattern;
    public factForm: FormGroup;
    public categories: Category[] = [];
    public subCategories: SubCategory[] = [];
    public categoryLoading = false;
    public actualUnitShortName = '';
    public isUpdate = false;
    public formLoaded = false;
    // Venue labels are set from local storage
    public firstVenueLabel = this.projectEventService.instant.firstVenue;
    public secondVenueLabel = this.projectEventService.instant.secondVenue;

    public isTotalRequired = false;
    public isFirstValueRequired = false;
    public isSecondValueRequired = false;

    private pipe: ThousandDelimiterPipe;

    public constructor(private readonly projectEventService: ProjectEventService,
                       private readonly formBuilder: FormBuilder,
                       private readonly businessAreaService: BusinessAreaService,
                       private readonly activatedRoute: ActivatedRoute,
                       private readonly factService: FactService,
                       private readonly notificationService: NotificationService, ) {
    }

    /**
     * Fact form getter of controls
     */
    public get controls() {
        return this.factForm.controls;
    }

    /**
     * Set listeners and default form in initialization
     */
    public ngOnInit() {
        // Set default form group
        this.factForm = this.formBuilder.group({
            category: [
                '',
                Validators.required
            ],
            subCategory: [
                '',
                Validators.required
            ],
            firstValue: [
                '',
                Validators.required
            ],
            secondValue: [
                '',
                Validators.required
            ],
            description: [''],
            hasOnlyTotalValue: [false],
            totalValue: [
                {
                    value: '',
                    disabled: true
                }
            ]
        });
        this.loadCategories();
        this.checkIfUpdate();

        // Category input listener
        this.factForm.controls.category.valueChanges.subscribe((value) => {
            this.actualUnitShortName = '';
            this.factForm.controls.subCategory.patchValue('');
            if (value && Number(value)) {
                this.loadSubCategories(value);
            }
        });

        // Subcategory input listener
        this.factForm.controls.subCategory.valueChanges.subscribe((value) => {
            const subcategory = this.subCategories.find((subCategory) => subCategory.id === value);
            if (!(subcategory === null || subcategory === undefined)) {
                this.actualUnitShortName = subcategory.unitShortName;
            }
        });

        // First value input listener
        this.factForm.controls.firstValue.valueChanges.subscribe((value) => {
            const number = this.transformNumberValue(this.factForm.value.secondValue, value);
            this.factForm.controls.totalValue.patchValue(this.pipe.transform(number.toString(), ','));
        });

        // Second value input listener
        this.factForm.controls.secondValue.valueChanges.subscribe((value) => {
            const number = this.transformNumberValue(this.factForm.value.firstValue, value);
            this.factForm.controls.totalValue.patchValue(this.pipe.transform(number.toString(), ','));
        });

        // Emit value changes to parent component
        this.factForm.valueChanges.subscribe(() => {
            this.emitFormDataChangeEmitter();
        });

        // Listener on checkbox input if has only total value
        this.factForm.controls.hasOnlyTotalValue.valueChanges.subscribe(() => {
            this.oneValueSelected();
        });

        this.pipe = new ThousandDelimiterPipe();

    }

    /**
     * Load categories from API into selected array
     */
    private loadCategories() {
        this.categoryLoading = true;
        this.businessAreaService.listCategories()
            .pipe(finalize(() => this.categoryLoading = false))
            .subscribe((data) => {
                this.categories = data.content;
            });
    }

    /**
     * Load specified category subcategories from API into selected array
     * @param categoryId
     */
    private loadSubCategories(categoryId) {
        this.categoryLoading = true;
        this.businessAreaService.listSubCategories(categoryId)
            .pipe(finalize(() => this.categoryLoading = false))
            .subscribe((data) => {
                this.subCategories = data;
            });
    }

    /**
     * Emit data for wrapper form create or form edit component
     */
    private emitFormDataChangeEmitter(): void {
        const isInvalid = (this.factForm.value.firstValue === '.' || this.factForm.value.secondValue === '.' || this.factForm.value.totalValue === '.') ||
            (this.factForm.value.firstValue === ',' || this.factForm.value.secondValue === ',' || this.factForm.value.totalValue === ',');
        if (this.factForm.invalid || isInvalid) {
            this.onFormDataChange.emit(null);
        } else {
            const actualValue = {
                ...this.factForm.value,
            };
            this.onFormDataChange.emit(actualValue);
        }
    }

    /**
     * Check if form is for update fact screen based on url parameters
     */
    private checkIfUpdate() {
        this.activatedRoute.queryParams.subscribe((param) => {
            if (Object.keys(param).length > 0) {
                this.isUpdate = true;
                this.getIdFromRouteParamsAndSetDetail(param);
            }
        });
    }

    /**
     * Set update form based on id from url
     * @param param
     */
    private getIdFromRouteParamsAndSetDetail(param: any): void {
        this.factService.getFactById(param.id, param.projectId)
            .subscribe((apiTask) => {
                this.setForm(apiTask);
            }, (error) => this.notificationService.openErrorNotification(error));
    }

    /**
     * Set controls of fact form if has only total value
     */
    private oneValueSelected() {
        const hasOnlyTotalValue = this.factForm.controls.hasOnlyTotalValue.value;

        if (hasOnlyTotalValue) {
            this.controls.firstValue.clearValidators();
            this.controls.secondValue.clearValidators();
            this.controls.totalValue.setValidators(Validators.required);
            this.isFirstValueRequired = false;
            this.isSecondValueRequired = false;
            this.isTotalRequired = true;

            this.factForm.controls.totalValue.enable();
            this.factForm.controls.firstValue.disable();
            this.factForm.controls.secondValue.disable();
        } else {
            this.controls.firstValue.setValidators(Validators.required);
            this.controls.secondValue.setValidators(Validators.required);
            this.controls.totalValue.clearValidators();
            this.isFirstValueRequired = true;
            this.isSecondValueRequired = true;
            this.isTotalRequired = false;

            this.factForm.controls.totalValue.disable();
            this.factForm.controls.firstValue.enable();
            this.factForm.controls.secondValue.enable();
        }

        this.controls.firstValue.setValue('');
        this.controls.secondValue.setValue('');
        this.controls.totalValue.setValue('');
    }

    /**
     * Set form for update fact commponent, listeners update and form controls update
     * @param fact
     */
    private setForm(fact: any) {
        this.firstVenueLabel = fact.venueFirst;
        this.secondVenueLabel = fact.venueSecond;
        this.actualUnitShortName = fact.subCategory.unitShortName;
        const hasChangedBy: boolean = fact.changedBy && fact.changedBy.firstName && fact.changedBy.lastName;
        this.isFirstValueRequired = true;
        this.isSecondValueRequired = true;
        this.isTotalRequired = false;
        this.factForm = this.formBuilder.group({
            category: [
                fact.category.category,
                Validators.required
            ],
            subCategory: [
                fact.subCategory.subCategory,
                Validators.required
            ],
            firstValue: [
                !(fact.valueFirst === null || fact.valueFirst === undefined) ? this.pipe.transform(fact.valueFirst.toString(), ',') : '',
                Validators.required
            ],
            secondValue: [
                !(fact.valueSecond === null || fact.valueSecond === undefined) ? this.pipe.transform(fact.valueSecond.toString(), ',') : '',
                Validators.required
            ],
            hasOnlyTotalValue: [fact.hasOnlyTotalValue],
            totalValue: [
                !(fact.totalValue === null || fact.totalValue === undefined) ? this.pipe.transform(parseFloat(fact.totalValue)
                    .toFixed(2)
                    .toString(), ',') : ''
            ],
            changedAt: [fact.changedAt ? this.formatDateTime(new Date(fact.changedAt)) : ''],
            changedBy: [hasChangedBy ? `${fact.changedBy.firstName} ${fact.changedBy.lastName}` : ''],
            description: fact.description ? fact.description : ''
        });

        this.factForm.controls.firstValue.valueChanges.subscribe((value) => {
            const number = this.transformNumberValue(this.factForm.value.secondValue, value);
            this.factForm.controls.totalValue.patchValue(this.pipe.transform(number.toString(), ','));
        });

        this.factForm.controls.secondValue.valueChanges.subscribe((value) => {
            const number = this.transformNumberValue(this.factForm.value.firstValue, value);
            this.factForm.controls.totalValue.patchValue(this.pipe.transform(number.toString(), ','));
        });

        this.factForm.valueChanges.subscribe(() => {
            this.emitFormDataChangeEmitter();
        });

        this.factForm.controls.totalValue.disable();
        this.factForm.controls.changedAt.disable();
        this.factForm.controls.changedBy.disable();

        this.formLoaded = true;

        this.factForm.controls.hasOnlyTotalValue.valueChanges.subscribe(() => {
            this.oneValueSelected();
        });

        if (fact.hasOnlyTotalValue) {
            this.controls.firstValue.clearValidators();
            this.controls.secondValue.clearValidators();
            this.controls.totalValue.setValidators(Validators.required);
            this.isFirstValueRequired = false;
            this.isSecondValueRequired = false;
            this.isTotalRequired = true;

            setTimeout(() => {
                this.factForm.controls.firstValue.disable();
                this.factForm.controls.secondValue.disable();
                this.factForm.controls.totalValue.enable();

                this.factForm.controls.totalValue.patchValue(fact.totalValue.toString());
            }, 200);
        }
    }

    /**
     * Transform Date object into formated
     * @param date
     */
    private formatDateTime(date: Date): string {
        if (!date) {
            return '';
        }
        return moment(date)
            .format('D.M.YYYY - HH:mm:ss');
    }

    /**
     * Transformation for number value
     * @param formValue
     * @param value
     */
    private transformNumberValue(formValue: any, value: any) {
        return formValue ? (+value.replace(',', '.')
                                  .replace(' ', '') + parseFloat(formValue.replace(',', '.')
                                                                          .replace(' ', '')))
            .toFixed(2) : +value.replace(',', '.')
                                .replace(' ', '');
    }

}
