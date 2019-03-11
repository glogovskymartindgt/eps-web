import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule, SharedDirectivesModule } from '../../shared/hazlenut/hazelnut-common';
import { MenuComponent } from './menu/menu.component';
import { SideOptionsComponent } from './side-options/side-options.component';

@NgModule({
    declarations: [
        MenuComponent,
        SideOptionsComponent
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
