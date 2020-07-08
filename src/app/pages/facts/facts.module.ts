import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AbstractInputsModule } from '../../shared/hazelnut/abstract-inputs';
import { CoreTableModule } from '../../shared/hazelnut/core-table';
import { MaterialModule } from '../../shared/hazelnut/hazelnut-common';
import { PipesModule } from '../../shared/pipes/pipes.module';
import { TableChangeStorageService } from '../../shared/services/table-change-storage.service';
import { FactCreateComponent } from './fact-create/fact-create.component';
import { FactEditComponent } from './fact-edit/fact-edit.component';
import { FactFormComponent } from './fact-form/fact-form.component';
import { FactListComponent } from './fact-list/fact-list.component';
import { FactsRoutingModule } from './facts-routing.module';

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
        AbstractInputsModule,
        PipesModule
    ],
    providers: [
        TableChangeStorageService,
    ],
})
export class FactsModule {
}
