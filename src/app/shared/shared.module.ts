import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from './components/components.module';
import { ShowByRoleDirective } from './directives/show-by-role.directive';
import { AbstractInputsModule } from './hazelnut/abstract-inputs';
import { CoreTableModule } from './hazelnut/core-table';
import { MaterialModule } from './hazelnut/hazelnut-common';
import { SmallComponentsModule } from './hazelnut/small-components';
import { PipesModule } from './pipes/pipes.module';

@NgModule({
    declarations: [
        ShowByRoleDirective,
    ],
    imports: [
        CommonModule,
        MaterialModule,
        FlexLayoutModule,
        TranslateModule.forChild(),
        FormsModule,
        ReactiveFormsModule,
        CoreTableModule,
        AbstractInputsModule,
        SmallComponentsModule,
        PipesModule,
        ComponentsModule,
    ],
    exports: [
        CommonModule,
        MaterialModule,
        FlexLayoutModule,
        TranslateModule,
        FormsModule,
        ReactiveFormsModule,
        CoreTableModule,
        AbstractInputsModule,
        SmallComponentsModule,
        PipesModule,
        ComponentsModule,
        ShowByRoleDirective,
    ],
})

export class SharedModule {
}
