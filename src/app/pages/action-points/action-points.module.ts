import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from '../../shared/components/components.module';
import { AbstractInputsModule } from '../../shared/hazelnut/abstract-inputs';
import { CoreTableModule } from '../../shared/hazelnut/core-table';
import { MaterialModule } from '../../shared/hazelnut/hazelnut-common';
import { SmallComponentsModule } from '../../shared/hazelnut/small-components';
import { PipesModule } from '../../shared/pipes/pipes.module';
import { TableChangeStorageService } from '../../shared/services/table-change-storage.service';
import { TranslateWrapperService } from '../../shared/services/translate-wrapper.service';
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
        SmallComponentsModule,
        PipesModule,
        ComponentsModule
    ],
    providers: [
        TranslateWrapperService,
        TableChangeStorageService,
    ]
})
export class ActionPointsModule {
}
