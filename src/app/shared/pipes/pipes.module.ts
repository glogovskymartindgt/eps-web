import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { VenuePipe } from './venue.pipe';

@NgModule({
    declarations: [VenuePipe],
    imports: [
        CommonModule,
    ],
    exports: [VenuePipe]
})
export class PipesModule {
}
