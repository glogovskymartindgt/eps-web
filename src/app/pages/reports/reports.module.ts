import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AbstractInputsModule } from '../../shared/hazlenut/abstract-inputs';
import { CoreTableModule } from '../../shared/hazlenut/core-table';
import { MaterialModule } from '../../shared/hazlenut/hazelnut-common';
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
        AbstractInputsModule
    ]
})
export class ReportsModule {
}
