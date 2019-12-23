import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CoreTableModule } from '../../shared/hazelnut/core-table';
import { MaterialModule } from '../../shared/hazelnut/hazelnut-common';
import { SmallComponentsModule } from '../../shared/hazelnut/small-components';
import { BusinessAreaListComponent } from './business-area-list/business-area-list.component';
import { BusinessAreasRoutingModule } from './business-areas-routing.module';

@NgModule({
    declarations: [BusinessAreaListComponent],
    imports: [
        CommonModule,
        BusinessAreasRoutingModule,
        MaterialModule,
        FlexLayoutModule,
        TranslateModule.forChild(),
        ReactiveFormsModule,
        CoreTableModule,
        SmallComponentsModule
    ]
})
export class BusinessAreasModule {
}
