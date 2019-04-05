import { AfterViewChecked, ChangeDetectorRef, Component, forwardRef, Inject, Input, OnInit } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { MatFormFieldAppearance } from '@angular/material';
import { debounceTime, tap } from 'rxjs/operators';
import { TRANSLATE_WRAPPER_TOKEN, TranslateWrapper } from '../../hazelnut-common/interfaces/translate.interface';
import { InputUtils } from '../../hazelnut-common/utils/input-utils';
import { ValidatorComposer } from '../validator-composer';

@Component({
    selector: 'haz-core-input',
    templateUrl: './core-input.component.html',
    styleUrls: ['./core-input.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => CoreInputComponent),
            multi: true
        }
    ]
})
export class CoreInputComponent implements OnInit, ControlValueAccessor, AfterViewChecked {
    @Input() public label?: string;
    @Input() public placeholder?: string;
    @Input() public useInstantTranslates = false;
    @Input() public required = false;
    @Input() public minLength?: number;
    @Input() public maxLength?: number;
    @Input() public exactLength?: number;
    @Input() public allowedCharactersPattern?: string;
    @Input() public pattern?: string;
    @Input() public styles = {width: '100%'};
    @Input() public appearance: MatFormFieldAppearance = 'standard';
    @Input() public type: 'string' | 'textarea' = 'string'; // TODO: Email, Password

    @Input() public errorRequired;
    @Input() public errorMinlength;
    @Input() public errorPattern;
    @Input() public hintMaxlength;
    @Input() public hintBadCharacter;

    public errors: { [key: string]: string } = {};

    public formControl: FormControl;
    public displayedError: string;
    public displayedHint: string;
    public showErrors: boolean;

    public constructor(@Inject(TRANSLATE_WRAPPER_TOKEN) protected readonly translateWrapperService: TranslateWrapper,
                       private readonly changeDetectorRef: ChangeDetectorRef,
                       protected readonly validatorComposer: ValidatorComposer
    ) {
    }

    public ngOnInit(): void {
        // TODO implement show errors toggle function
        this.showErrors = true;
        this.minLength = this.setAsExactIfNaN(this.minLength);
        this.maxLength = this.setAsExactIfNaN(this.maxLength);
        this.setFormControl();
        this.onFormControlChanges();

        InputUtils.setDefaultTranslates(this, this.translateWrapperService, this.useInstantTranslates);
    }

    public ngAfterViewChecked(): void {
        this.changeDetectorRef.detectChanges();
    }

    public onChange(value: string): void {
    }

    public onTouched(value: string): void {
    }

    public writeValue(value: string): void {
        // this.value = value || '';
        // this.onChange(this.value);
        this.formControl.setValue(value || '', {emitEvent: false});
    }

    public registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    public registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    public setDisabledState?(isDisabled: boolean): void {
        if (isDisabled) {
            this.formControl.disable();
        } else {
            this.formControl.enable();
        }
    }

    private manageUserInput(): void {

        if (!this.formControl.errors) {
            this.displayedError = '';
            this.onChange(this.formControl.value);
            return;
        }
        switch (true) {
            case Boolean(this.formControl.errors.required):
                this.displayedError = this.showErrors ? this.errorRequired : (this.displayedError = '');
                break;
            case Boolean(this.formControl.errors.maxlength):
                this.removeInsertedCharacterAndShowHint(this.formControl, this.hintMaxlength);
                break;
            case Boolean(this.formControl.errors.pattern):
                if (this.formControl.errors.pattern.requiredPattern.includes(this.allowedCharactersPattern)) {
                    this.removeInsertedCharacterAndShowHint(this.formControl, this.hintBadCharacter);
                }
                if (
                    this.formControl &&
                    this.formControl.errors &&
                    this.formControl.errors.pattern &&
                    this.formControl.errors.pattern.requiredPattern.includes(this.pattern)
                ) {
                    this.displayedError = this.showErrors ? this.errorPattern : '';
                }
                break;
            case Boolean(this.formControl.errors.minlength):
                this.displayedError =
                    this.showErrors && this.exactLength
                        ? `${this.formControl.errors.minlength.actualLength}/${this.formControl.errors.minlength.requiredLength}`
                        : `${this.errorMinlength} (${this.formControl.errors.minlength.requiredLength})`;
                break;
            default: {
                this.displayedError = '';
                break;
            }
        }
        this.onChange(this.formControl.value);
    }

    private onFormControlChanges(): void {
        this.formControl.valueChanges
            .pipe(
                tap(() => this.manageUserInput()),
                debounceTime(2000)
            )
            .subscribe(() => {
                this.displayedHint = '';
            });
    }

    private removeInsertedCharacterAndShowHint(abstractControl: AbstractControl, hint: string): void {
        abstractControl.setValue(abstractControl.value.slice(0, -1));
        this.displayedHint = hint;
    }

    private toggleShowErrors(focused: boolean): any {
        this.showErrors = focused;
        this.manageUserInput();
    }

    private setAsExactIfNaN(value: number): number {
        if (isNaN(value)) {
            value = this.exactLength;
        }

        return value;
    }

    private setFormControl(): void {
        const validators = Validators.compose(
            this.validatorComposer.addValidators(this.required, this.minLength, this.maxLength, this.pattern, this.allowedCharactersPattern)
        );
        this.formControl = new FormControl('', {
            validators
        });
    }
}
