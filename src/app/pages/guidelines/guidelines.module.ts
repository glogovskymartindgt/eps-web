import { NgModule } from '@angular/core';
import { AbstractInputsModule, TRANSLATE_WRAPPER_TOKEN } from 'hazelnut';
import { TranslateWrapperService } from '../../shared/services/translate-wrapper.service';
import { SharedModule } from '../../shared/shared.module';
import { GuidelineCreateComponent } from './guideline-detail/guideline-create.component';
import { GuidelineEditComponent } from './guideline-detail/guideline-edit.component';
import { GuidelineListComponent } from './guideline-list/guideline-list.component';
import { GuidelinesRoutingModule } from './guidelines-routing.module';
import { AddSelecteBusinessAreaPipe } from './pipes/add-selecte-business-area.pipe';

@NgModule({
    declarations: [
        AddSelecteBusinessAreaPipe,
        GuidelineCreateComponent,
        GuidelineEditComponent,
        GuidelineListComponent,
    ],
    imports: [
        SharedModule,
        AbstractInputsModule,
        GuidelinesRoutingModule,
    ],
    providers: [
        TranslateWrapperService,
        {
            provide: TRANSLATE_WRAPPER_TOKEN,
            useExisting: TranslateWrapperService,
        }
    ]
})
export class GuidelinesModule {
}
