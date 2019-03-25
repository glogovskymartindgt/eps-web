import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AbstractInputsModule } from '../../shared/hazlenut/abstract-inputs';
import { CoreTableModule } from '../../shared/hazlenut/core-table';
import { MaterialModule } from '../../shared/hazlenut/hazelnut-common';
import { FactCreateComponent } from './fact-create/fact-create.component';
import { FactListComponent } from './fact-list/fact-list.component';
import { FactsRoutingModule } from './facts-routing.module';
import { FactFormComponent } from './fact-form/fact-form.component';
import { FactEditComponent } from './fact-edit/fact-edit.component';

@NgModule({
    declarations: [FactListComponent, FactCreateComponent, FactFormComponent, FactEditComponent],
    imports: [
        CommonModule,
        FactsRoutingModule,
        MaterialModule,
        FlexLayoutModule,
        TranslateModule.forChild(),
        ReactiveFormsModule,
        CoreTableModule,
        AbstractInputsModule
    ]
})
export class FactsModule {
}
