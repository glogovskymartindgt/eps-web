import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import { MomentDateAdapter } from '@angular/material-moment-adapter';

import * as _moment from 'moment';
import { filter } from 'rxjs/operators';

const moment = _moment;

export const FORMAT = {
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
    selector: 'haz-input-date',
    templateUrl: './input-date.component.html',
    styleUrls: ['./input-date.component.scss'],
    providers: [
        {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
        {provide: MAT_DATE_FORMATS, useValue: FORMAT},
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => InputDateComponent),
            multi: true
        },
    ],
})
export class InputDateComponent implements OnInit, ControlValueAccessor {
    @Input() public placeholder: string;
    @Input() public dateWidth = 100;
    @Input() public min: Date;
    @Input() public max: Date;
    private lastValue;
    public formControl = new FormControl();

    public constructor() {
    }

    public ngOnInit() {
        this.onFormControlChanges();
    }

    public setDisabledState(isDisabled: boolean): void {
        if (isDisabled) {
            this.formControl.disable();
        } else {
            this.formControl.enable();
        }
    }

    public onChange(value: string): void {
    }

    public onTouched(value: string): void {
    }

    public writeValue(value: string): void {
        this.formControl.setValue(value || '', {emitEvent: false});
    }

    public registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    public registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    private onFormControlChanges(): void {
        this.formControl.valueChanges.pipe(filter((newValue) => newValue !== this.lastValue)).subscribe((newValue) => {
            this.lastValue = newValue;
            this.onChange(this.formControl.value);
        });
    }
}
