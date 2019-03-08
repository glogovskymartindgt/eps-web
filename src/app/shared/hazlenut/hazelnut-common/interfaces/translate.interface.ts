import { InjectionToken } from '@angular/core';
import { merge, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { KeyValue } from '../hazelnut/interfaces/key-value.interface';

export interface TranslateWrapper {
    get(key: string): Observable<string>;

    /**
     * get translate instantly
     *
     */
    instant(key: string): string;
}

export const TRANSLATE_WRAPPER_TOKEN = new InjectionToken<TranslateWrapper>('translateServiceWrapper');

/**
 * Method extract translates from json with translates and map them into {@link Observable} contains translate as {@link KeyValue}
 *
 */
export function mergeTranslates(translateWrapperService: TranslateWrapper, ...keys: string[]): Observable<KeyValue> {
    /*merge(translateWrapperService.get('errorRequired').pipe(map((res) => ['errorRequired', res])),
        translateWrapperService.get('errorMinlength').pipe(map((res) => ['errorMinlength', res])),
        translateWrapperService.get('errorPattern').pipe(map((res) => ['errorPattern', res])),
        translateWrapperService.get('hintMaxlength').pipe(map((res) => ['hintMaxlength', res])),
        translateWrapperService.get('hintBadCharacter').pipe(map((res) => ['hintBadCharacter', res]))
    )
    */
    return merge(...keys.map((key) => translateWrapperService.get(key)
        .pipe(map((value) => ({key, value})))));
}
