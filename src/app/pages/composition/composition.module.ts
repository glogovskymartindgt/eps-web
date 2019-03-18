import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule, SharedDirectivesModule } from '../../shared/hazlenut/hazelnut-common';
import { MenuComponent } from './menu/menu.component';
import { SideOptionsComponent } from './side-options/side-options.component';
import { SecondaryHeaderComponent } from './menu/secondary-header/secondary-header.component';

@NgModule({
    declarations: [
        MenuComponent,
        SideOptionsComponent,
        SecondaryHeaderComponent
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
