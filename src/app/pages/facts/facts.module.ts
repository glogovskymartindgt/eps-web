import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CoreTableModule } from '../../shared/hazlenut/core-table';
import { MaterialModule } from '../../shared/hazlenut/hazelnut-common';
import { FactListComponent } from './fact-list/fact-list.component';
import { FactsRoutingModule } from './facts-routing.module';
import { FactCreateComponent } from './fact-create/fact-create.component';

@NgModule({
    declarations: [FactListComponent, FactCreateComponent],
    imports: [
        CommonModule,
        FactsRoutingModule,
        MaterialModule,
        FlexLayoutModule,
        TranslateModule.forChild(),
        ReactiveFormsModule,
        CoreTableModule
    ]
})
export class FactsModule {
}
