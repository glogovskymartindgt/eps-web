import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ThousandDelimiterPipe } from './thousand-delimiter.pipe';
import { VenuePipe } from './venue.pipe';
import { TagsPipe } from './tags.pipe';

@NgModule({
    declarations: [VenuePipe, ThousandDelimiterPipe, TagsPipe],
    imports: [
        CommonModule,
    ],
    exports: [VenuePipe, ThousandDelimiterPipe, TagsPipe]
})
export class PipesModule {
}
