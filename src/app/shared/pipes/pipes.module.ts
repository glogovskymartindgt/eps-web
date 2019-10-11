import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ThousandDelimiterPipe } from './thousand-delimiter.pipe';
import { VenuePipe } from './venue.pipe';

@NgModule({
    declarations: [VenuePipe, ThousandDelimiterPipe],
    imports: [
        CommonModule,
    ],
    exports: [VenuePipe, ThousandDelimiterPipe]
})
export class PipesModule {
}
