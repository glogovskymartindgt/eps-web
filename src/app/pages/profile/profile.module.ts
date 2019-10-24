import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AbstractInputsModule } from '../../shared/hazlenut/abstract-inputs';
import { MaterialModule, SharedDirectivesModule } from '../../shared/hazlenut/hazelnut-common';
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
        SharedDirectivesModule,
    ]
})
export class ProfileModule {
}
