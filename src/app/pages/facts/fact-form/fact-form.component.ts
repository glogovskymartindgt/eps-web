import { HttpResponse } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import * as moment from 'moment';
import { finalize } from 'rxjs/operators';
import { enterLeaveSmooth } from '../../../shared/hazelnut/hazelnut-common/animations';
import { BrowseResponse } from '../../../shared/hazelnut/hazelnut-common/models';
import { Regex } from '../../../shared/hazelnut/hazelnut-common/regex/regex';
import { Category } from '../../../shared/interfaces/category.interface';
import { Fact } from '../../../shared/interfaces/fact.interface';
import { SubCategory } from '../../../shared/interfaces/subcategory.interface';
import { ThousandDelimiterPipe } from '../../../shared/pipes/thousand-delimiter.pipe';
import { BusinessAreaService } from '../../../shared/services/data/business-area.service';
import { FactService } from '../../../shared/services/data/fact.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { ProjectEventService } from '../../../shared/services/storage/project-event.service';

@Component({
    selector: 'iihf-fact-form',
    templateUrl: './fact-form.component.html',
    styleUrls: ['./fact-form.component.scss'],
    animations: [enterLeaveSmooth]
})

export class FactFormComponent implements OnInit {
    @Output() public readonly formDataChange = new EventEmitter<any>();
    public decimalPattern = Regex.decimalPattern;
    public factForm: FormGroup;
    public categories: Category[] = [];
    public subCategories: SubCategory[] = [];
    public categoryLoading = false;
    public actualUnitShortName = '';
    public isUpdate = false;
    public formLoaded = false;
    public firstVenueLabel = this.projectEventService.instant.firstVenue;
    public secondVenueLabel = this.projectEventService.instant.secondVenue;
    public isTotalRequired = false;
    public isFirstValueRequired = false;
    public isSecondValueRequired = false;
    private thousandDelimiterPipee: ThousandDelimiterPipe;

    public constructor(private readonly projectEventService: ProjectEventService,
                       private readonly formBuilder: FormBuilder,
                       private readonly businessAreaService: BusinessAreaService,
                       private readonly activatedRoute: ActivatedRoute,
                       private readonly factService: FactService,
                       private readonly notificationService: NotificationService) {
    }

    /**
     * Fact form getter of controls
     */
    public get controls(): any {
        return this.factForm.controls;
    }

    /**
     * Set listeners and default form in initialization
     */
    public ngOnInit(): void {
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
        this.factForm.controls.category.valueChanges.subscribe((value: any): void => {
            this.actualUnitShortName = '';
            this.factForm.controls.subCategory.patchValue('');
            if (value && Number(value)) {
                this.loadSubCategories(value);
            }
        });

        // Subcategory input listener
        this.factForm.controls.subCategory.valueChanges.subscribe((value: any): void => {
            const subcategory = this.subCategories.find((subCategory: SubCategory): any => subCategory.id === value);
            if (!(subcategory === null || subcategory === undefined)) {
                this.actualUnitShortName = subcategory.unitShortName;
            }
        });

        // First value input listener
        this.factForm.controls.firstValue.valueChanges.subscribe((firstValue: any): void => {
            const numberValue = this.transformNumberValue(this.factForm.value.secondValue, firstValue);
            this.factForm.controls.totalValue.patchValue(this.thousandDelimiterPipee.transform(numberValue.toString(), ','));
        });

        // Second value input listener
        this.factForm.controls.secondValue.valueChanges.subscribe((secondValue: any): void => {
            const numberValue = this.transformNumberValue(this.factForm.value.firstValue, secondValue);
            this.factForm.controls.totalValue.patchValue(this.thousandDelimiterPipee.transform(numberValue.toString(), ','));
        });

        // Emit value changes to parent component
        this.factForm.valueChanges.subscribe((): void => {
            this.emitFormDataChangeEmitter();
        });

        // Listener on checkbox input if has only total value
        this.factForm.controls.hasOnlyTotalValue.valueChanges.subscribe((): void => {
            this.oneValueSelected();
        });

        this.thousandDelimiterPipee = new ThousandDelimiterPipe();

    }

    public trackCategoryById(index: number, category: Category): number {
        return category.id;
    }

    public trackSubCategoryById(index: number, subCategory: SubCategory): number {
        return subCategory.id;
    }

    /**
     * Load categories from API into selected array
     */
    private loadCategories(): void {
        this.categoryLoading = true;
        this.businessAreaService.listCategories()
            .pipe(finalize((): any => this.categoryLoading = false))
            .subscribe((data: BrowseResponse<Category>): void => {
                this.categories = data.content;
            });
    }

    /**
     * Load specified category subcategories from API into selected array
     * @param categoryId
     */
    private loadSubCategories(categoryId): void {
        this.categoryLoading = true;
        this.businessAreaService.listSubCategories(categoryId)
            .pipe(finalize((): any => this.categoryLoading = false))
            .subscribe((data: SubCategory[]): void => {
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
            this.formDataChange.emit(null);
        } else {
            const actualValue = {
                ...this.factForm.value,
            };
            this.formDataChange.emit(actualValue);
        }
    }

    /**
     * Check if form is for update fact screen based on url parameters
     */
    private checkIfUpdate(): void {
        this.activatedRoute.queryParams.subscribe((param: Params): void => {
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
            .subscribe((apiTask: Fact): void => {
                this.setForm(apiTask);
            }, (error: HttpResponse<any>): any => this.notificationService.openErrorNotification(error));
    }

    /**
     * Set controls of fact form if has only total value
     */
    private oneValueSelected(): void {
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
    private setForm(fact: any): void {
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
                this.transformValue(fact.valueFirst),
                Validators.required
            ],
            secondValue: [
                this.transformValue(fact.valueSecond),
                Validators.required
            ],
            hasOnlyTotalValue: [fact.hasOnlyTotalValue],
            totalValue: [
                !(fact.totalValue === null || fact.totalValue === undefined) ? this.thousandDelimiterPipee.transform(parseFloat(fact.totalValue)
                    .toFixed(2)
                    .toString(), ',') : ''
            ],
            changedAt: [fact.changedAt ? this.formatDateTime(new Date(fact.changedAt)) : ''],
            changedBy: [hasChangedBy ? `${fact.changedBy.firstName} ${fact.changedBy.lastName}` : ''],
            description: fact.description ? fact.description : ''
        });

        this.factForm.controls.firstValue.valueChanges.subscribe((firstValue: any): void => {
            const numberValue = this.transformNumberValue(this.factForm.value.secondValue, firstValue);
            this.factForm.controls.totalValue.patchValue(this.thousandDelimiterPipee.transform(numberValue.toString(), ','));
        });

        this.factForm.controls.secondValue.valueChanges.subscribe((secondValue: any): void => {
            const numberValue = this.transformNumberValue(this.factForm.value.firstValue, secondValue);
            this.factForm.controls.totalValue.patchValue(this.thousandDelimiterPipee.transform(numberValue.toString(), ','));
        });

        this.factForm.valueChanges.subscribe((): void => {
            this.emitFormDataChangeEmitter();
        });

        this.factForm.controls.totalValue.disable();
        this.factForm.controls.changedAt.disable();
        this.factForm.controls.changedBy.disable();

        this.formLoaded = true;

        this.factForm.controls.hasOnlyTotalValue.valueChanges.subscribe((): void => {
            this.oneValueSelected();
        });

        if (fact.hasOnlyTotalValue) {
            this.controls.firstValue.clearValidators();
            this.controls.secondValue.clearValidators();
            this.controls.totalValue.setValidators(Validators.required);
            this.isFirstValueRequired = false;
            this.isSecondValueRequired = false;
            this.isTotalRequired = true;
            const updateTotalTimeout = 200;
            setTimeout((): void => {
                this.factForm.controls.firstValue.disable();
                this.factForm.controls.secondValue.disable();
                this.factForm.controls.totalValue.enable();

                this.factForm.controls.totalValue.patchValue(this.transformValue(fact.totalValue));
            }, updateTotalTimeout);
        }
    }

    private transformValue(value: any): any {
        return !(value === null || value === undefined) ? this.thousandDelimiterPipee.transform(value.toString(), ',') : '';
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
    private transformNumberValue(formValue: any, value: any): any {
        return formValue ? (+value.replace(',', '.')
                                  .replace(' ', '') + parseFloat(formValue.replace(',', '.')
                                                                          .replace(' ', '')))
            .toFixed(2) : +value.replace(',', '.')
                                .replace(' ', '');
    }

}
