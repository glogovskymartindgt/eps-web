import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { SharedDirectivesModule } from '../hazelnut-common/directives';
import { MaterialModule } from '../hazelnut-common/material/material.module';
import { BlockComponent } from './block/block.component';
import { MenuComponent } from './menu/menu.component';
import { SelectedOptionDirective } from './side-options/selected-option.directive';
import { SideOptionsComponent } from './side-options/side-options.component';
import { TopOptionsComponent } from './top-options/top-options.component';

@NgModule({
    declarations: [
        MenuComponent,
        BlockComponent,
        TopOptionsComponent,
        SideOptionsComponent,
        SelectedOptionDirective,
    ],
    imports: [
        CommonModule,
        FlexLayoutModule,
        MaterialModule,
        SharedDirectivesModule,
        RouterModule,
    ],
    exports: [
        MenuComponent,
        BlockComponent,
        SelectedOptionDirective
    ]
})
export class LayoutModule {
}
