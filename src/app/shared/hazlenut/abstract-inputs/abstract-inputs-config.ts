import { InjectionToken } from '@angular/core';

export interface AbstractInputsConfig {
    /**
     * @deprecated - translateWrapper translateServiceWrapper must be inject in standalone provider
     */
    translateWrapper?: any;
}

export const ABSTRACT_INPUT_TOKEN = new InjectionToken<AbstractInputsConfig>('abstractInputConfig');
