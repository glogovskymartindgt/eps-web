import { Injectable } from '@angular/core';
import { ValidatorFn, Validators } from '@angular/forms';

@Injectable({
    providedIn: 'root'
})
export class ValidatorComposer {
    public addValidators(
        required = true,
        minLength?: number,
        maxLength?: number,
        pattern?: string,
        allowedCharacters?: string
    ): ValidatorFn[] {
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
        if (allowedCharacters) {
            validators.push(Validators.pattern(allowedCharacters));
        }

        return [...validators];
    }
}
