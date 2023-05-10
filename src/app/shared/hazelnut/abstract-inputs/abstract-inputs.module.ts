import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../hazelnut-common/material/material.module';
import { ABSTRACT_INPUT_TOKEN, AbstractInputsConfig } from './abstract-inputs-config';
import { CoreInputComponent } from './core-input/core-input.component';
import { InputDateRangeComponent } from './input-date-range/input-date-range.component';
import { InputDateComponent } from './input-date/input-date.component';
import { InputNumberRangeComponent } from './input-number-range/input-number-range.component';
import { InputNumberComponent } from './input-number/input-number.component';
import { CoreSelectComponent } from './core-select/core-select.component';

@NgModule({
    declarations: [
        CoreInputComponent,
        InputNumberComponent,
        InputNumberRangeComponent,
        InputDateRangeComponent,
        InputDateComponent,
        CoreSelectComponent
    ],
    imports: [
        CommonModule,
        MaterialModule,
        ReactiveFormsModule,
    ],
    exports: [
        CoreInputComponent,
        InputNumberComponent,
        InputNumberRangeComponent,
        InputDateRangeComponent,
        InputDateComponent,
        CoreSelectComponent
    ]
})
export class AbstractInputsModule {
    public static forRoot(config: AbstractInputsConfig): ModuleWithProviders {
        return {
            ngModule: AbstractInputsModule,
            providers: [
                {provide: ABSTRACT_INPUT_TOKEN, useValue: config}
            ]
        };
    }
}
