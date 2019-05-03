import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { tap } from 'rxjs/internal/operators/tap';
import { enterLeaveSmooth } from '../../../shared/hazlenut/hazelnut-common/animations';
import { Regex } from '../../../shared/hazlenut/hazelnut-common/regex/regex';
import { Category } from '../../../shared/interfaces/category.interface';
import { SubCategory } from '../../../shared/interfaces/subcategory.interface';
import { BusinessAreaService } from '../../../shared/services/data/business-area.service';
import { FactService } from '../../../shared/services/data/fact.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { ProjectEventService } from '../../../shared/services/storage/project-event.service';
import { isNullOrUndefined } from 'util';

@Component({
    selector: 'fact-form',
    templateUrl: './fact-form.component.html',
    styleUrls: ['./fact-form.component.scss'],
    animations: [enterLeaveSmooth]
})
export class FactFormComponent implements OnInit {
    @Output('formDataChange') public onFormDataChange = new EventEmitter<any>();
    public decimalPattern = Regex.decimalPattern;
    public factForm: FormGroup;
    public categories: Category[] = [];
    public subCategories: SubCategory[] = [];
    public categoryLoading = false;
    public actualUnitShortName = '';
    public isUpdate = false;
    public formLoaded = false;
    public readonly firstVenueLabel = this.projectEventService.instant.firstVenue;
    public readonly secondVenueLabel = this.projectEventService.instant.secondVenue;

    isTotalRequired = false;
    isFirstValueRequired = false;
    isSecondValueRequired = false;

    public constructor(private readonly projectEventService: ProjectEventService,
                       private readonly formBuilder: FormBuilder,
                       private readonly businessAreaService: BusinessAreaService,
                       private readonly activatedRoute: ActivatedRoute,
                       private readonly factService: FactService,
                       private readonly notificationService: NotificationService,
    ) {
    }

    public ngOnInit() {
        this.factForm = this.formBuilder.group({
            category: ['', Validators.required],
            subCategory: ['', Validators.required],
            firstValue: ['', Validators.required],
            secondValue: ['', Validators.required],
            hasOnlyTotalValue: [false],
            totalValue: [{value: '', disabled: true}]
        });
        this.loadCategories();
        this.checkIfUpdate();

        this.factForm.controls.category.valueChanges.subscribe((value) => {
            this.actualUnitShortName = '';
            this.factForm.controls.subCategory.patchValue('');
            if (value && Number(value)) {
                this.loadSubCategories(value);
            }
        });

        this.factForm.controls.subCategory.valueChanges.subscribe((value) => {
            const subcategory = this.subCategories.find(
                (subCategory) => subCategory.id = value
            );
            if (!isNullOrUndefined(subcategory)) {
                this.actualUnitShortName = subcategory.unitShortName;
            }
        });

        this.factForm.controls.firstValue.valueChanges.subscribe((value) => {            
            const num = (+value + +this.factForm.value.secondValue).toFixed(2);
            this.factForm.controls.totalValue.patchValue(num.toString());
        });

        this.factForm.controls.secondValue.valueChanges.subscribe((value) => {
            const num = (+this.factForm.value.firstValue + +value).toFixed(2);
            this.factForm.controls.totalValue.patchValue(num.toString());
        });

        this.factForm.valueChanges.subscribe(() => {
            this.emitFormDataChangeEmitter();
        });

        this.factForm.controls.hasOnlyTotalValue.valueChanges.subscribe(() => {
            this.oneValueSelected();
        });       

    }

    public get controls() {
        return this.factForm.controls;
    }

    private loadCategories() {
        this.categoryLoading = true;
        this.businessAreaService.listCategories()
            .pipe(
                tap(() => this.categoryLoading = false)
            )
            .subscribe((data) => {
                this.categories = data.content;
            });
    }

    private loadSubCategories(categoryId) {
        this.categoryLoading = true;
        this.businessAreaService.listSubCategories(categoryId)
            .pipe(
                tap(() => this.categoryLoading = false)
            )
            .subscribe((data) => {
                this.subCategories = data;
            });
    }

    private emitFormDataChangeEmitter(): void {
        const isInvalid = (this.factForm.value.firstValue === '.' || this.factForm.value.secondValue === '.' || this.factForm.value.totalValue === '.');
        if (this.factForm.invalid || isInvalid) {
            this.onFormDataChange.emit(null);
        } else {
            const actualValue = {
                ...this.factForm.value,
            };
            this.onFormDataChange.emit(actualValue);            
        }
    }

    private checkIfUpdate() {
        this.activatedRoute.queryParams.subscribe((param) => {
            if (Object.keys(param).length > 0) {
                this.isUpdate = true;
                this.getIdFromRouteParamsAndSetDetail(param);
            }
        });
    }

    private getIdFromRouteParamsAndSetDetail(param: any): void {
        this.factService.getFactById(param.id).subscribe((apiTask) => {
            this.setForm(apiTask);
        }, (error) => this.notificationService.openErrorNotification(error));
    }

    private oneValueSelected() {
        const hasOnlyTotalValue = this.factForm.controls.hasOnlyTotalValue.value;
        
        if (hasOnlyTotalValue) {
            this.controls['firstValue'].clearValidators();
            this.controls['secondValue'].clearValidators();
            this.controls['totalValue'].setValidators(Validators.required);
            this.isFirstValueRequired = false;
            this.isSecondValueRequired = false;
            this.isTotalRequired = true;

            this.factForm.controls.totalValue.enable();
            this.factForm.controls.firstValue.disable();
            this.factForm.controls.secondValue.disable();
        } else {
            this.controls['firstValue'].setValidators(Validators.required);
            this.controls['secondValue'].setValidators(Validators.required);
            this.controls['totalValue'].clearValidators();
            this.isFirstValueRequired = true;
            this.isSecondValueRequired = true;
            this.isTotalRequired = false;

            this.factForm.controls.totalValue.disable();
            this.factForm.controls.firstValue.enable();
            this.factForm.controls.secondValue.enable();
        }

        this.controls['firstValue'].setValue('');
        this.controls['secondValue'].setValue('');
        this.controls['totalValue'].setValue('');
    }

    private setForm(task: any) {
        const hasChangedBy: boolean = task.changedBy && task.changedBy.firstName && task.changedBy.lastName;
        this.isFirstValueRequired = true;
        this.isSecondValueRequired = true;
        this.isTotalRequired = false;
        this.factForm = this.formBuilder.group({
            category: [task.category.category, Validators.required],
            subCategory: [task.subCategory.subCategory, Validators.required],
            firstValue: [!isNullOrUndefined(task.valueFirst) ? task.valueFirst.toString() : '', Validators.required],
            secondValue: [!isNullOrUndefined(task.valueSecond) ? task.valueSecond.toString() : '', Validators.required],
            hasOnlyTotalValue: [task.hasOnlyTotalValue],
            totalValue: [!isNullOrUndefined(task.totalValue) ? parseFloat(task.totalValue).toFixed(2).toString() : ''],
            changedAt: [task.changedAt ? this.formatDateTime(new Date(task.changedAt)) : ''],
            changedBy: [hasChangedBy ? `${task.changedBy.firstName} ${task.changedBy.lastName}` : '']
        });

        this.factForm.controls.firstValue.valueChanges.subscribe((value) => {
            const num = (+value + +this.factForm.value.secondValue).toFixed(2);
            this.factForm.controls.totalValue.patchValue(num.toString());
        });

        this.factForm.controls.secondValue.valueChanges.subscribe((value) => {
            const num = (+this.factForm.value.firstValue + +value).toFixed(2);
            this.factForm.controls.totalValue.patchValue(num.toString());
        });

        this.factForm.valueChanges.subscribe(() => {
            this.emitFormDataChangeEmitter();
        });

        this.factForm.controls.totalValue.patchValue(
            (+this.factForm.value.firstValue + +this.factForm.value.secondValue).toFixed(2).toString()
        );

        this.factForm.controls.totalValue.disable();
        this.factForm.controls.changedAt.disable();
        this.factForm.controls.changedBy.disable();

        this.formLoaded = true;

        this.factForm.controls.hasOnlyTotalValue.valueChanges.subscribe(() => {
            this.oneValueSelected();
        });

        if (task.hasOnlyTotalValue) {
            this.controls['firstValue'].clearValidators();
            this.controls['secondValue'].clearValidators();
            this.controls['totalValue'].setValidators(Validators.required);
            this.isFirstValueRequired = false;
            this.isSecondValueRequired = false;
            this.isTotalRequired = true;

            setTimeout(() => {
                this.factForm.controls.firstValue.disable();
                this.factForm.controls.secondValue.disable();
                this.factForm.controls.totalValue.enable();
                
                this.factForm.controls.totalValue.patchValue(task.totalValue.toString());
            }, 200);
        }
    }

    private formatDateTime(date: Date): string {
        if (!date) {
            return '';
        }

        return moment(date).format('D.M.YYYY - HH:mm:ss');
    }

}
