import {
    AfterViewChecked,
    ChangeDetectorRef,
    Component,
    forwardRef,
    Inject,
    Input,
    OnInit
} from '@angular/core';
import {
    ControlValueAccessor,
    FormBuilder,
    FormControl,
    FormGroup,
    NG_VALUE_ACCESSOR,
    ValidationErrors,
    Validators
} from '@angular/forms';

import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { StringUtils } from '../../hazelnut-common/hazelnut/utils/string.utils';
import { TRANSLATE_WRAPPER_TOKEN, TranslateWrapper } from '../../hazelnut-common/interfaces/translate.interface';
import { Regex } from '../../hazelnut-common/regex/regex';

const DATE_FORMAT = 'DD.MM.YYYY';

export interface DateRangeModel {
    dateFrom: any;
    dateTo: any;
}

@Component({
    selector: 'haz-input-date-range',
    templateUrl: './input-date-range.component.html',
    styleUrls: ['./input-date-range.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => InputDateRangeComponent),
            multi: true
        },
        {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    ]
})
export class InputDateRangeComponent implements OnInit, ControlValueAccessor, AfterViewChecked {
    @Input() public fromLabel: string;
    @Input() public toLabel: string;
    @Input() public type: 'date' | 'dateTime' = 'dateTime'; // TODO: create enum
    @Input() public dateWidth;

    @Input() public errorMessageMinmax = '';

    public minmaxError = true;
    public dateRangeForm: FormGroup;
    public showColumnErrorMessage: boolean;
    public errorInterval = this.translateWrapperService.instant('error.interval');
    private readonly columnErrorMessage = '';
    private readonly tooltipMessage = this.errorMessageMinmax;
    private errorMessage: string;

    public constructor(
        private readonly cdRef: ChangeDetectorRef,
        private readonly formBuilder: FormBuilder,
        @Inject(TRANSLATE_WRAPPER_TOKEN) protected readonly translateWrapperService: TranslateWrapper) {
    }

    public get fromFormControl(): FormControl {
        return this.dateRangeForm.get('from') as FormControl;
    }

    public get toFormControl(): FormControl {
        return this.dateRangeForm.get('to') as FormControl;
    }

    private static areDateEquals(currentDate: DateRangeModel, newDate: DateRangeModel) {
        if (currentDate === newDate) {
            return true;
        }
        if (!currentDate || !newDate) {
            return false;
        }

        if (currentDate.dateTo === newDate.dateTo && currentDate.dateFrom === newDate.dateFrom) {
            return true;
        }
        return (currentDate.dateTo && currentDate.dateTo._d) === (newDate.dateTo && newDate.dateTo._d) &&
            (currentDate.dateFrom && currentDate.dateFrom._d) === (newDate.dateFrom && newDate.dateFrom._d);
    }

    public ngOnInit(): void {
        this.setLabels();
        this.dateRangeForm = this.createForm();
        this.onFormGroupChanges(this.dateRangeForm);
        this.onFormControlChanges(this.fromFormControl);
        this.onFormControlChanges(this.toFormControl);
    }

    public onChange(value: any): void {
    }

    public onTouched(value: any): void {
    }

    public registerOnChange(method: (value: any) => void): void {
        this.onChange = method;
    }

    public registerOnTouched(method: (value: any) => void): void {
        this.onTouched = method;
    }

    public ngAfterViewChecked(): void {
        this.cdRef.detectChanges();
    }

    public writeValue(value: DateRangeModel): void {
        if (!value) {
            return this.writeValue({dateFrom: null, dateTo: null});
        }
        if (value.dateTo && this.toFormControl.value !== value.dateTo && this.toFormControl.value._d !== value.dateTo._d) {
            console.log('set to');
            this.toFormControl.setValue(value.dateTo, {emitEvent: false});
        }
        if (value.dateFrom && this.fromFormControl.value !== value.dateFrom && this.fromFormControl.value._d !== value.dateFrom._d) {
            console.log('set from');
            this.fromFormControl.setValue(value.dateFrom, {emitEvent: false});
        }
        this.cdRef.detectChanges();
    }

    private minMaxValidator(formGroup: FormGroup): ValidationErrors {

        const fromFormControl = formGroup.get('from');
        const toFormControl = formGroup.get('to');

        this.minmaxError = fromFormControl.value && toFormControl.value &&
            (Number(fromFormControl.value) > Number(toFormControl.value));

        return fromFormControl.value &&
        toFormControl.value &&
        (Number(fromFormControl.value) > Number(toFormControl.value)) ? {minmax: true} : null;
    }

    public transformToDate(object: any) {
        return object ? new Date(object) : null;
    }

    private createForm(): FormGroup {
        return this
            .formBuilder.group({
                from: [null, {
                validators: Validators.compose([
                    Validators.required])
            }],
                to: [null, {
                validators: Validators.compose([
                    Validators.required])
            }]
        }, {validator: this.minMaxValidator});
    }

    private onFormGroupChanges(formGroup: FormGroup): void {
        formGroup.valueChanges.subscribe((value) => {
            if (!this.momentDateIsValid(this.fromFormControl) || !this.momentDateIsValid(this.toFormControl)) {
                return;
            }

            if (!this.momentDateIsValid(this.fromFormControl) || !this.momentDateIsValid(this.toFormControl)) {
                return;
            }

            const newValue: DateRangeModel = {
                dateFrom: !this.momentDateIsFullDate(this.fromFormControl) ? null
                    : (this.fromFormControl.value.startOf('day').format()),
                dateTo: !this.momentDateIsFullDate(this.toFormControl) ? null
                    : (this.toFormControl.value.endOf('day').format())
            };

            this.onChange(newValue);
        });
    }

    private onFormControlChanges(formControl: FormControl): void {
        formControl.valueChanges.subscribe((value) => {
            this.manageUserInput(this.dateRangeForm);
        });
    }

    private momentDateIsValid(formControl: FormControl): boolean {
        if (!formControl.value || !formControl.value._i) {
            return true;
        }
        return (typeof formControl.value._i === 'string')
            ? RegExp(Regex.dateDotPattern).test(formControl.value._i)
            : RegExp(Regex.dateDotPattern).test(StringUtils.convertDateStringToDotString(formControl.value._d));
    }

    private momentDateIsFullDate(formControl: FormControl): boolean {
        if (!formControl.value || !formControl.value._i) {
            return false;
        }
        return (typeof formControl.value._i === 'string')
            ? RegExp(Regex.dateDotPattern).test(formControl.value._i)
            : RegExp(Regex.dateDotPattern).test(StringUtils.convertDateStringToDotString(formControl.value._d));
    }

    private manageUserInput(formGroup: FormGroup): void {
        if (!formGroup.errors) {
            this.showColumnErrorMessage = false;
            this.errorMessage = '';
        }
        if (formGroup.errors && formGroup.errors.minmax) {
            this.showColumnErrorMessage = true;
            this.errorMessage = StringUtils.format(this.errorMessageMinmax, {from: 'Od', to: 'Do'});
        }
    }

    private setLabels(): void {
        this.fromLabel = this.fromLabel ? this.fromLabel : 'common.from';
        this.toLabel = this.toLabel ? this.toLabel : 'common.to';
    }

}
