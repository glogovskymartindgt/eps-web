import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { AbstractInputsModule } from '../../shared/hazelnut/abstract-inputs';
import { MaterialModule, SharedDirectivesModule } from '../../shared/hazelnut/hazelnut-common';
import { PipesModule } from '../../shared/pipes/pipes.module';
import { ProfileDetailComponent } from './profile-detail/profile-detail.component';

import { ProfileRoutingModule } from './profile-routing.module';

@NgModule({
    declarations: [ProfileDetailComponent],
    imports: [
        CommonModule,
        ProfileRoutingModule,
        MaterialModule,
        FlexLayoutModule,
        TranslateModule.forChild(),
        ReactiveFormsModule,
        AbstractInputsModule,
        PipesModule,
        SharedDirectivesModule
    ]
})
export class ProfileModule {
}
