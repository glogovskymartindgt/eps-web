import { ValidatorFn, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { TranslateWrapper } from '../interfaces/translate.interface';

export class InputUtils {
    public static addValidators(required = true, minLength?: number, maxLength?: number, pattern?: string): ValidatorFn[] {
        const validators: ValidatorFn[] = [];
        if (required) {
            validators.push(Validators.required);
        }
        if (minLength && minLength > 0) {
            validators.push(Validators.minLength(minLength));
        }
        if (maxLength && maxLength > 0) {
            validators.push(Validators.maxLength(maxLength));
        }
        if (pattern) {
            validators.push(Validators.pattern(pattern));
        }

        return [...validators];
    }

    public static setDefaultTranslates(target: any, translationService: TranslateWrapper, instant: boolean): void {
        if (instant) {
            target.errorRequired = target.errorRequired || translationService.instant('error.required');
            target.errorMinlength = target.errorMinlength || translationService.instant('error.minlength');
            target.errorPattern = target.errorPattern || translationService.instant('error.pattern');
            target.hintMaxlength = target.hintMaxlength || translationService.instant('hint.maxlength');
            target.hintBadCharacter = target.hintBadCharacter || translationService.instant('hint.badCharacter');
        } else {
            translationService.get('error.required').subscribe((translate) => {
                target.errorRequired = translate;
            });
            translationService.get('error.minlength').subscribe((translate) => {
                target.errorMinlength = translate;
            });
            translationService.get('error.pattern').subscribe((translate) => {
                target.errorPattern = translate;
            });

            translationService.get('hint.maxlength').subscribe((translate) => {
                target.hintMaxlength = translate;
            });
            translationService.get('hint.badCharacter').subscribe((translate) => {
                target.hintBadCharacter = translate;
            });
        }
    }

    public static setFromToTranslates(target: any, translationService: TranslateWrapper): void {
        target.fromLabel = target.fromLabel || translationService.instant('common.from');
        target.toLabel = target.toLabel || translationService.instant('common.to');
    }
}
