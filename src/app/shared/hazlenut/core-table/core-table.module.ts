import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AbstractInputsModule } from '../abstract-inputs/abstract-inputs.module';
import { MaterialModule } from '../hazelnut-common/material/material.module';
import { RoundToDecimalPipe, SharedPipesModule } from '../hazelnut-common/pipes';
import { CoreTableFilterComponent } from './components/core-table-filter/core-table-filter.component';
import { CoreTableComponent } from './components/core-table.component';
import { TableCellClickableComponent } from './components/table-cell-clickable/table-cell-clickable.component';
import { TableCellComponent } from './components/table-cell/table-cell.component';
import { CoreTableConfigInterface, GLOBAL_CONFIG_TOKEN } from './core-table-config.interface';
import { ExpandedDetailDirective } from './directives/expanded-detail.directive';
import { TableCellCustomizedDirective } from './directives/table-cell-customized.directive';
import { TableFilterCustomizedDirective } from './directives/table-filter-customized.directive';

@NgModule({
    declarations: [
        CoreTableComponent,
        CoreTableFilterComponent,
        ExpandedDetailDirective,
        TableCellClickableComponent,
        TableCellComponent,
        TableCellCustomizedDirective,
        TableFilterCustomizedDirective,
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        AbstractInputsModule,
        MaterialModule,
        FlexLayoutModule,
        SharedPipesModule,
    ],
    providers: [RoundToDecimalPipe],
    exports: [CoreTableComponent],
})
export class CoreTableModule {
    public static forRoot(config: CoreTableConfigInterface): ModuleWithProviders {
        return {
            ngModule: CoreTableModule,
            providers: [
                {provide: GLOBAL_CONFIG_TOKEN, useValue: config},
            ],
        };
    }
}
