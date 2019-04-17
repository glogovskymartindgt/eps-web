import { Component, forwardRef, Inject, Input, OnInit, TemplateRef } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { merge, Observable } from 'rxjs';
import { tap } from 'rxjs/internal/operators/tap';
import { MathUtils, Regexp, StringMap } from '../..//hazelnut-common/hazelnut';
import { InputUtils } from '../..//hazelnut-common/utils/input-utils';
import { NumberType } from '../../hazelnut-common/enums/number-type.enum';
import { TRANSLATE_WRAPPER_TOKEN, TranslateWrapper } from '../../hazelnut-common/interfaces/translate.interface';
import { Interval } from './interval.interface';

@Component({
    selector: 'haz-input-number-range',
    templateUrl: './input-number-range.component.html',
    styleUrls: ['./input-number-range.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => InputNumberRangeComponent),
            multi: true
        }
    ]
})
export class InputNumberRangeComponent implements OnInit, ControlValueAccessor {
    @Input() public min = NaN;
    @Input() public max = NaN;
    @Input() public type = NumberType.FLOAT;
    @Input() public inputStyles = {width: '30px'};
    @Input() public styles = {};
    @Input() public customInput: TemplateRef<any>;
    @Input() public fromLabel: Observable<string>;
    @Input() public toLabel: Observable<string>;
    @Input() public useInstantTranslates = false;
    @Input() public inputSize = 165;

    public readonly pattern = Regexp.numericCharactersPattern;
    public readonly fromControl: FormControl = new FormControl();
    public readonly toControl: FormControl = new FormControl();
    public actualError = '';
    public _disabled = false;
    public errorInterval = this.translateWrapperService.instant('error.interval');

    public constructor(@Inject(TRANSLATE_WRAPPER_TOKEN) protected readonly translateWrapperService: TranslateWrapper) {
    }

    public get disabled(): boolean {
        return this._disabled;
    }

    public set disabled(value: boolean) {
        this._disabled = value;
        if (value) {
            this.fromControl.disable();
            this.toControl.disable();
        } else {
            this.fromControl.enable();
            this.toControl.enable();
        }
    }

    public onChange(value: Interval): void {
    }

    public onTouched(value: Interval): void {
    }

    public registerOnChange(method: (value: Interval) => void): void {
        this.onChange = method;
    }

    public registerOnTouched(method: (value: Interval) => void): void {
        this.onTouched = method;
    }

    public get realStyles(): StringMap {
        return {
            ...this.styles,
            width: '60px',
        };
    }

    public get value(): Interval {
        return {
            from: this.fromControl.value,
            to: this.toControl.value,
        };
    }

    public ngOnInit(): void {
        InputUtils.setFromToTranslates(this, this.translateWrapperService);
        merge(this.toControl.valueChanges, this.fromControl.valueChanges).subscribe(() => {
            this.onChange(this.value);
            if (
                this.value.from &&
                this.value.to &&
                this.toDotFormat(this.value.from) > this.toDotFormat(this.value.to)
            ) {
                this.actualError = 'minmax';
            } else {
                this.actualError = '';
            }
        });
    }

    public setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    public writeValue(obj: Interval<number | string>): void {
        if (!obj) {
            return this.writeValue({from: '', to: ''});
        }
        this._setFrom(obj.from);
        this._setTo(obj.to);
    }

    private _setFrom(value: number | string, emitEvent = false) {
        this.fromControl.setValue(MathUtils.validateValue({value, type: this.type}), {emitEvent});
    }

    private _setTo(value: number | string, emitEvent = false) {
        this.toControl.setValue(MathUtils.validateValue({value, type: this.type}), {emitEvent});
    }

    private toDotFormat(value) {
        return Number(String(value).replace(',', '.'));
    }

}
