import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule, SharedDirectivesModule } from '../../shared/hazelnut/hazelnut-common';
import { MenuComponent } from './menu/menu.component';
import { SecondaryHeaderProjectComponent } from './menu/secondary-header-project/secondary-header-project.component';
import { SecondaryHeaderSettingsComponent } from './menu/secondary-header-settings/secondary-header-settings.component';
import { SideOptionsProjectComponent } from './side-options-project/side-options-project.component';
import { SideOptionsSettingsComponent } from './side-options-settings/side-options-settings.component';

@NgModule({
    declarations: [
        MenuComponent,
        SideOptionsProjectComponent,
        SideOptionsSettingsComponent,
        SecondaryHeaderProjectComponent,
        SecondaryHeaderSettingsComponent,
    ],
    imports: [
        CommonModule,
        FlexLayoutModule,
        MaterialModule,
        SharedDirectivesModule,
        RouterModule,
        TranslateModule.forChild(),
    ],
    exports: [
        MenuComponent,
    ]
})
export class CompositionModule {
}
