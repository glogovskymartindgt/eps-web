import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs/internal/operators/tap';
import { enterLeaveSmooth } from '../../../shared/hazlenut/hazelnut-common/animations';
import { Regex } from '../../../shared/hazlenut/hazelnut-common/regex/regex';
import { Category } from '../../../shared/interfaces/category.interface';
import { SubCategory } from '../../../shared/interfaces/subcategory.interface';
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
export class FactFormComponent implements OnInit {
    @Output('formDataChange') public onFormDataChange = new EventEmitter<any>();
    public doublePattern = Regex.doublePattern;
    public factForm: FormGroup;
    public categories: Category[] = [];
    public subCategories: SubCategory[] = null;
    public categoryLoading = false;
    public actualUnitShortName = '';
    public isUpdate = false;
    public formLoaded = false;
    private readonly firstVenueLabel = this.projectEventService.instant.firstVenue;
    private readonly secondVenueLabel = this.projectEventService.instant.secondVenue;

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
            totalValue: [{value: '', disabled: true}],
        });
        this.loadCategories();
        this.checkIfUpdate();

        this.factForm.controls.category.valueChanges.subscribe((value) => {
            this.actualUnitShortName = '';
            if (value && Number(value)) {
                this.loadSubCategories(value);
            }
        });

        this.factForm.controls.subCategory.valueChanges.subscribe((value) => {
            this.actualUnitShortName = this.subCategories.find(
                (subCategory) => subCategory.id = value
            ).unitShortName;
        });

        this.factForm.controls.firstValue.valueChanges.subscribe((value) => {
            this.factForm.controls.totalValue.patchValue(+value +
                +this.factForm.value.secondValue);
        });

        this.factForm.controls.secondValue.valueChanges.subscribe((value) => {
            this.factForm.controls.totalValue.patchValue(+this.factForm.value.firstValue +
                +value);
        });

        this.factForm.valueChanges.subscribe(() => {
            this.emitFormDataChangeEmitter();
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
        if (this.factForm.invalid) {
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

    private setForm(task: any) {
        this.factForm = this.formBuilder.group({
            category: [task.category.id, Validators.required],
            subCategory: [task.subCategory.subCategory, Validators.required],
            firstValue: [task.valueFirst, Validators.required],
            secondValue: [task.valueSecond, Validators.required],
            totalValue: [''],
            changedAt: [task.changedAt ? task.changedAt : ''],
            changedBy: [task.changedBy ? task.changedBy : '']
        });

        this.factForm.controls.firstValue.valueChanges.subscribe((value) => {
            this.factForm.controls.totalValue.patchValue(+value +
                +this.factForm.value.secondValue);
        });

        this.factForm.controls.secondValue.valueChanges.subscribe((value) => {
            this.factForm.controls.totalValue.patchValue(+this.factForm.value.firstValue +
                +value);
        });

        this.factForm.valueChanges.subscribe(() => {
            this.emitFormDataChangeEmitter();
        });

        this.factForm.controls.totalValue.patchValue(+this.factForm.value.firstValue + +this.factForm.value.secondValue);

        this.factForm.controls.totalValue.disable();
        this.factForm.controls.changedAt.disable();
        this.factForm.controls.changedBy.disable();

        this.formLoaded = true;
    }

}
