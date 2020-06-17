import { NgModule } from '@angular/core';
import { TranslateWrapperService } from '../../shared/services/translate-wrapper.service';
import { SharedModule } from '../../shared/shared.module';
import { GuidelineListComponent } from './guideline-list/guideline-list.component';
import { GuidelinesRoutingModule } from './guidelines-routing.module';

@NgModule({
    declarations: [
        GuidelineListComponent,
    ],
    imports: [
        SharedModule,
        GuidelinesRoutingModule,
    ],
    providers: [TranslateWrapperService]
})
export class GuidelinesModule {
}
