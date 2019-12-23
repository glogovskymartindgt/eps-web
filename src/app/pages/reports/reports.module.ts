import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AbstractInputsModule } from '../../shared/hazelnut/abstract-inputs';
import { CoreTableModule } from '../../shared/hazelnut/core-table';
import { MaterialModule } from '../../shared/hazelnut/hazelnut-common';
import { SmallComponentsModule } from '../../shared/hazelnut/small-components';
import { ReportListComponent } from './report-list/report-list.component';
import { ReportsRoutingModule } from './reports-routing.module';

@NgModule({
    declarations: [ReportListComponent],
    imports: [
        CommonModule,
        ReportsRoutingModule,
        MaterialModule,
        FlexLayoutModule,
        TranslateModule.forChild(),
        ReactiveFormsModule,
        CoreTableModule,
        AbstractInputsModule,
        SmallComponentsModule
    ]
})
export class ReportsModule {
}
