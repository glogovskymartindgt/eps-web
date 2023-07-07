import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { AbstractInputsModule, CoreTableModule, MaterialModule, SmallComponentsModule } from '@hazelnut';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../../../shared/shared.module';
import { TagsRoutingModule } from './tags-routing.module';
import { TagsEditComponent } from './tags-edit/tags-edit.component';
import { TagsFormComponent } from './tags-form/tags-form.component';
import { TagsListComponent } from './tags-list/tags-list.component';

@NgModule({
    declarations: [TagsListComponent, TagsFormComponent, TagsEditComponent],
    imports: [
        CommonModule,
        TagsRoutingModule,
        MaterialModule,
        FlexLayoutModule,
        TranslateModule.forChild(),
        ReactiveFormsModule,
        CoreTableModule,
        AbstractInputsModule,
        SmallComponentsModule,
        SharedModule
    ]
})
export class TagsModule {
}
