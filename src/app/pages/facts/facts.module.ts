import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { TableChangeStorageService } from '../../shared/services/table-change-storage.service';
import { SharedModule } from '../../shared/shared.module';
import { FactCreateComponent } from './fact-create/fact-create.component';
import { FactEditComponent } from './fact-edit/fact-edit.component';
import { FactFormComponent } from './fact-form/fact-form.component';
import { FactListComponent } from './fact-list/fact-list.component';
import { FactsRoutingModule } from './facts-routing.module';

@NgModule({
    declarations: [FactListComponent, FactCreateComponent, FactFormComponent, FactEditComponent],
    imports: [
        FactsRoutingModule,
        TranslateModule.forChild(),
        SharedModule,
    ],
    providers: [
        TableChangeStorageService,
    ],
})
export class FactsModule {
}
