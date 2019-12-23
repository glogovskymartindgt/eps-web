import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AbstractInputsModule } from '../../shared/hazelnut/abstract-inputs';
import { HazelnutCommonModule, MaterialModule } from '../../shared/hazelnut/hazelnut-common';
import { TranslateWrapperService } from '../../shared/services/translate-wrapper.service';
import { LoginComponent } from './login/login.component';
import { sessionRoutes } from './session-routing.module';

@NgModule({
    declarations: [LoginComponent],
    imports: [
        CommonModule,
        MaterialModule,
        ReactiveFormsModule,
        HazelnutCommonModule,
        RouterModule.forChild(sessionRoutes),
        FlexLayoutModule,
        TranslateModule.forChild(),
        AbstractInputsModule.forRoot({}),
    ],
    providers: [TranslateWrapperService]
})
export class SessionModule {
}
