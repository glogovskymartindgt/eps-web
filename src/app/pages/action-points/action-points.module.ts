import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AbstractInputsModule, CoreTableModule, MaterialModule } from '@hazelnut';
import { TranslateModule } from '@ngx-translate/core';
import { SmallComponentsModule } from 'hazelnut';
import { ComponentsModule } from '../../shared/components/components.module';
import { PipesModule } from '../../shared/pipes/pipes.module';
import { TableChangeStorageService } from '../../shared/services/table-change-storage.service';
import { TranslateWrapperService } from '../../shared/services/translate-wrapper.service';
import { SharedModule } from '../../shared/shared.module';
import { ActionPointCreateComponent } from './action-point-create/action-point-create.component';
import { ActionPointEditComponent } from './action-point-edit/action-point-edit.component';
import { ActionPointFormComponent } from './action-point-form/action-point-form.component';
import { ActionPointListComponent } from './action-point-list/action-point-list.component';
import { ActionPointsRoutingModule } from './action-points-routing.module';


@NgModule({
    declarations: [
        ActionPointListComponent,
        ActionPointCreateComponent,
        ActionPointEditComponent,
        ActionPointFormComponent
    ],
    imports: [
        CommonModule,
        ActionPointsRoutingModule,
        MaterialModule,
        FlexLayoutModule,
        TranslateModule.forChild(),
        FormsModule,
        ReactiveFormsModule,
        CoreTableModule,
        AbstractInputsModule,
        PipesModule,
        ComponentsModule,
        SharedModule,
        SmallComponentsModule
    ],
    providers: [
        TranslateWrapperService,
        TableChangeStorageService,
    ]
})
export class ActionPointsModule {
}
