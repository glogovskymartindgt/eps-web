import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  forwardRef,
  Inject,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges
} from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { MatFormFieldAppearance } from '@angular/material/form-field';
import { debounceTime, tap } from 'rxjs/operators';
import { checkAndRemoveLastDotComma } from '../../../utils/remove-last-char';
import { TRANSLATE_WRAPPER_TOKEN, TranslateWrapper } from '../../hazelnut-common/interfaces/translate.interface';
import { InputUtils } from '../../hazelnut-common/utils/input-utils';
import { ValidatorComposer } from '../validator-composer';
import { ThousandDelimiterPipe } from './../../../pipes/thousand-delimiter.pipe';
import { SelectOption } from 'src/app/shared/interfaces/select-option.interface';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'haz-core-select',
  templateUrl: './core-select.component.html',
  styleUrls: ['./core-select.component.scss'],
  providers: [
    {
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => CoreSelectComponent),
        multi: true
    }
]
})
export class CoreSelectComponent implements OnInit, OnChanges, ControlValueAccessor, AfterViewChecked {

  @Input() public label?: string;
  @Input() public placeholder?: string = this.translate.instant('common.chooseOption');
  @Input() public useInstantTranslates = false;
  @Input() public required = false;
  @Input() public textSuffix?: string;
  @Input() public styles = {width: '100%'};
  @Input() public inputStyles ? = {width: '100%'};
  @Input() public appearance: MatFormFieldAppearance = 'standard';
  @Input() public options: SelectOption[] = [
    {id: 0, value: '1', string: 'Yes', stringKey: 'common.yes'},
    {id: 1, value: '0', string: 'No', stringKey: 'common.no'}
  ]

  @Input() public errorRequired;
  @Input() public errorMinlength;
  @Input() public errorPattern;
  @Input() public hintMaxlength;
  @Input() public hintBadCharacter;

  @Input() public handleFocusAndBlur = false;
  public errors: {[key: string]: string} = {};
  public formControl: FormControl;
  public displayedError: string;
  public displayedHint: string;
  public showErrors: boolean;
  private pipe: ThousandDelimiterPipe;

  public constructor(@Inject(TRANSLATE_WRAPPER_TOKEN) protected readonly translateWrapperService: TranslateWrapper,
                     private readonly changeDetectorRef: ChangeDetectorRef,
                     protected readonly validatorComposer: ValidatorComposer,
                     private readonly translate : TranslateService) {
  }

  @Input('disabled')
  public set disable(value: boolean) {
      this.setDisabledState(value);
  }

  public ngOnInit(): void {
      // TODO implement show errors toggle function
      this.showErrors = true;
      this.setFormControl();
      this.onFormControlChanges();

      InputUtils.setDefaultTranslates(this, this.translateWrapperService, this.useInstantTranslates);

      this.pipe = new ThousandDelimiterPipe();

      if (this.options && this.options.length > 0){
        this.options.map(o => {
          if (o.stringKey) {
            return {...o, string : this.translate.instant(o.stringKey)}
          } else {
            return o
          }
        })
      }
  }

  public ngOnChanges(changes: SimpleChanges): void {
      if (this.formControl) {
          const validators = Validators.compose(this.validatorComposer.addValidators(this.required));
          this.formControl.setValidators(validators);
      }
  }

  public ngAfterViewChecked(): void {
      this.changeDetectorRef.detectChanges();
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
          default: {
              this.displayedError = '';
              break;
          }
      }
      this.onChange(this.formControl.value);
  }

  private handleFocus(): void {
      if (this.handleFocusAndBlur) {
          this.formControl.setValue(this.formControl.value.replace(/\s/g, ''), {emitEvent: false});
          this.formControl.setValue(this.formControl.value.replace(',', '.'), {emitEvent: false});
      }
  }

  private handleBlur(): void {
      const blurTimeout = 250;
      if (this.handleFocusAndBlur) {
          this.formControl.setValue(checkAndRemoveLastDotComma(this.formControl.value));
          this.formControl.setValue(this.formControl.value.replace(/\s/g, ''), {emitEvent: false});
          setTimeout(() => {
              this.formControl.setValue(this.pipe.transform(this.formControl.value, ','), {emitEvent: false});
          }, blurTimeout);
      }
  }

  private onFormControlChanges(): void {
      const timeoutAfterChange = 2000;
      this.formControl.valueChanges
          .pipe(tap(() => {
              this.manageUserInput();
          }), debounceTime(timeoutAfterChange))
          .subscribe(() => {
              this.displayedHint = '';
          });
  }

  private toggleShowErrors(focused: boolean): any {
      this.showErrors = focused;
      this.manageUserInput();
  }

  private setFormControl(): void {
      const validators = Validators.compose(this.validatorComposer.addValidators(this.required));
      this.formControl = new FormControl('', {
          validators
      });
  }
}
