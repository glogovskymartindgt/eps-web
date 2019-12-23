import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RoundToDecimalPipe } from './round-to-decimal.pipe';

@NgModule({
    imports: [
        CommonModule,
    ],
    declarations: [
        RoundToDecimalPipe,
    ],
    exports: [
        RoundToDecimalPipe,
    ],
})
export class SharedPipesModule {
}
