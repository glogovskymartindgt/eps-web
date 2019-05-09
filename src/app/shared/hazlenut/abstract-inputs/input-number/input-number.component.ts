import { Component, forwardRef, Input, OnInit, TemplateRef } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Observable } from 'rxjs';
import { MathUtils } from '../..//hazelnut-common/hazelnut';
import { NumberType } from '../../hazelnut-common/enums/number-type.enum';

@Component({
    selector: 'haz-input-number',
    templateUrl: './input-number.component.html',
    styleUrls: ['./input-number.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => InputNumberComponent),
            multi: true
        }
    ]
})
// TODO: extends from {@link CoreInputComponent}
export class InputNumberComponent<T = number | string> implements OnInit, ControlValueAccessor {
    @Input() public type = NumberType.FLOAT;
    @Input() public customInput: TemplateRef<any>;
    @Input() public label: Observable<string>;
    @Input() public placeholder: string;

    @Input() public styles;
    @Input() public inputStyles;
    @Input() public labelStyles;

    public formattedValue: string;

    public readonly control = new FormControl(0);
    private lastValue: string;
    public constructor() {
    }

    public get disabled(): boolean {
        return this.control.disabled;
    }

    public set disabled(value: boolean) {
        if (value) {
            this.control.disable();
        } else {
            this.control.enable();
        }
    }

    public ngOnInit(): void {
        this.control.valueChanges.subscribe((value: string) => {
            // if number is not valid number
            if (value && (!value.match(/^-?\d+$/))) {
                this.control.setValue(this.lastValue);
                return;
            }
            this.lastValue = value;
            this.onChange(value as any);
        });
    }

    public onChange(value: T): void {
    }

    public onTouched(value: T): void {
    }

    public registerOnChange(method: (value: T) => void): void {
        this.onChange = method;
    }

    public registerOnTouched(method: (value: T) => void): void {
        this.onTouched = method;
    }

    public setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    public writeValue(value: T): void {
        this.control.setValue(MathUtils.validateValue<T>({value, type: this.type}), {emitEvent: false});
    }
}
