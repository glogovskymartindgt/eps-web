import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SafePipe } from './safe.pipe';
import { ThousandDelimiterPipe } from './thousand-delimiter.pipe';
import { VenuePipe } from './venue.pipe';

@NgModule({
    declarations: [VenuePipe, ThousandDelimiterPipe, SafePipe],
    imports: [
        CommonModule,
    ],
    exports: [VenuePipe, ThousandDelimiterPipe, SafePipe]
})
export class PipesModule {
}
