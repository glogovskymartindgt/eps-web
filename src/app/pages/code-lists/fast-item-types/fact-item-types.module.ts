import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { AbstractInputsModule, CoreTableModule, MaterialModule, SmallComponentsModule } from '@hazelnut';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../../../shared/shared.module';
import { FactItemTypesRoutingModule } from './fact-item-types-routing.module';
import { FastItemTypesCreateComponent } from './fast-item-types-create/fast-item-types-create.component';
import { FastItemTypesEditComponent } from './fast-item-types-edit/fast-item-types-edit.component';
import { FastItemTypesFormComponent } from './fast-item-types-form/fast-item-types-form.component';
import { FastItemTypesListComponent } from './fast-item-types-list/fast-item-types-list.component';

@NgModule({
    declarations: [FastItemTypesListComponent, FastItemTypesFormComponent, FastItemTypesEditComponent, FastItemTypesCreateComponent],
    imports: [
        CommonModule,
        FactItemTypesRoutingModule,
        MaterialModule,
        FlexLayoutModule,
        TranslateModule.forChild(),
        ReactiveFormsModule,
        CoreTableModule,
        AbstractInputsModule,
        SmallComponentsModule,
        SharedModule
    ]
})
export class FactItemTypesModule {
}
