import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedComponentsModule } from './components';
import { SharedDirectivesModule } from './directives';
import { SharedPipesModule } from './pipes';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        SharedComponentsModule,
        SharedDirectivesModule,
        SharedPipesModule,
    ],
    exports: [
        SharedComponentsModule,
        SharedDirectivesModule,
        SharedPipesModule,
    ],
})
export class HazelnutCommonModule {
}
