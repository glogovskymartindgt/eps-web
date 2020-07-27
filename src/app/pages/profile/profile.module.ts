import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { SharedDirectivesModule } from '../../shared/hazelnut/hazelnut-common';
import { SharedModule } from '../../shared/shared.module';
import { ProfileDetailComponent } from './profile-detail/profile-detail.component';

import { ProfileRoutingModule } from './profile-routing.module';

@NgModule({
    declarations: [ProfileDetailComponent],
    imports: [
        ProfileRoutingModule,
        TranslateModule.forChild(),
        SharedDirectivesModule,
        SharedModule,
    ]
})
export class ProfileModule {
}
