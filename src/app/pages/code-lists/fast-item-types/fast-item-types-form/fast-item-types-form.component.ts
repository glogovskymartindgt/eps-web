import { HttpResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { BrowseResponse } from '@hazelnut';
import { enterLeaveSmooth } from 'hazelnut';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { Category } from '../../../../shared/interfaces/category.interface';
import { FactItemType } from '../../../../shared/interfaces/fact-item-type';
import { MeasureUnit } from '../../../../shared/interfaces/measure-unit';
import { BusinessAreaService } from '../../../../shared/services/data/business-area.service';
import { FactItemTypeService } from '../../../../shared/services/data/factItemType.service';
import { NotificationService } from '../../../../shared/services/notification.service';

@Component({
    selector: 'iihf-fast-item-types-form',
    templateUrl: './fast-item-types-form.component.html',
    styleUrls: ['./fast-item-types-form.component.scss'],
    animations: [enterLeaveSmooth]
})

export class FastItemTypesFormComponent implements OnInit {
    @Output() public readonly formDataChange = new EventEmitter<any>();

    public factItemTypeForm: FormGroup;
    public categories: Category[] = [];
    public measureUnits: MeasureUnit[] = [];
    public categoryLoading = false;
    public measureUnitLoading = false;
    public formLoaded = false;
    public isUpdate = false;
    private _disabled: boolean = true;

    private readonly componentDestroyed$: Subject<boolean> = new Subject<boolean>();
    public constructor(private readonly formBuilder: FormBuilder,
                       private readonly businessAreaService: BusinessAreaService,
                       private readonly activatedRoute: ActivatedRoute,
                       private readonly factItemTypeService: FactItemTypeService,
                       private readonly notificationService: NotificationService) {
    }

    /**
     * Fact form getter of controls
     */
    public get controls(): any {
        return this.factItemTypeForm.controls;
    }

    /**
     * Set listeners and default form in initialization
     */
    public ngOnInit(): void {
        this.createForm();
        this.loadCategories();
        this.loadMeasureUnits();
        this.checkIfUpdate();
    }

    public trackCategoryById(index: number, category: Category): number {
        return category.id;
    }
    public trackMeasureUnitById(index: number, measureUnit: MeasureUnit): number {
        return measureUnit.id;
    }

    @Input()
    public set disabled(value: boolean) {
        this._disabled = value;

        if (!this.factItemTypeForm) {
            return;
        }

        if (this._disabled) {
            this.disableForm();
        } else {
            this.enableForm();
        }
    }

    public categoryName(categoryId: number) {
        return this.categories.find((category) => category.id === categoryId)?.name
    }
    public measureUnitName(measureUnitId: number) {
        const measureUnit = this.measureUnits.find((measureUnit: MeasureUnit) => measureUnit.id === measureUnitId);
        if (!measureUnit) {
            return '';
        }
        return `${measureUnit.name} (${measureUnit.shortName})`
    }

    private createForm(): void {
        this.factItemTypeForm = this.formBuilder.group({
            categoryId: [
                '',
                Validators.required
            ],
            factItemType: [
                '',
                Validators.required
            ],
            measureUnitId: [
                '',
                Validators.required
            ],
            state: [''],

        });
        this.factItemTypeForm.valueChanges
            .pipe(takeUntil(this.componentDestroyed$))
            .subscribe((): void => {
                this.emitFormDataChangeEmitter();
            });
    }

    private enableForm(): void {
        this.factItemTypeForm.enable();
    }

    private disableForm(): void {
        this.factItemTypeForm.disable();
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
     * Load categories from API into selected array
     */
    private loadMeasureUnits(): void {
        this.measureUnitLoading = true;
        this.businessAreaService.listMeasureUnits()
            .pipe(finalize((): any => this.measureUnitLoading = false))
            .subscribe((data: BrowseResponse<MeasureUnit>): void => {
                this.measureUnits = data.content;
            });
    }

    /**
     * Emit data for wrapper form create or form edit component
     */
    private emitFormDataChangeEmitter(): void {
        if (this.factItemTypeForm.invalid) {
            this.formDataChange.emit(null);
        } else {
            const actualValue = {
                ...this.factItemTypeForm.value,
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
                this.disableForm();
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
        this.factItemTypeService.getFactItemType(param.id)
            .subscribe((apiTask: FactItemType): void => {
                this.setForm(apiTask);
            }, (error: HttpResponse<any>): any => this.notificationService.openErrorNotification(error));
    }

    /**
     * Set form for update fact commponent, listeners update and form controls update
     * @param factItemType
     */
    private setForm(factItemType: any): void {
        this.factItemTypeForm = this.formBuilder.group({
            categoryId: [
                factItemType.categoryId,
                Validators.required
            ],
            factItemType: [
                factItemType.factItemType,
                Validators.required
            ],
            measureUnitId: [
                factItemType.measureUnitId,
                Validators.required
            ],
            state: [
                factItemType.state === 'ACTIVE'
            ],
        })

        this.factItemTypeForm.valueChanges.subscribe((): void => {
            this.emitFormDataChangeEmitter();
        });

        this.formLoaded = true;
    }
}
