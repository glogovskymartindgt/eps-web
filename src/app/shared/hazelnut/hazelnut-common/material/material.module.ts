import { A11yModule } from '@angular/cdk/a11y';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { BidiModule } from '@angular/cdk/bidi';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ObserversModule } from '@angular/cdk/observers';
import { OverlayModule } from '@angular/cdk/overlay';
import { PlatformModule } from '@angular/cdk/platform';
import { PortalModule } from '@angular/cdk/portal';
import { CdkTableModule } from '@angular/cdk/table';
import { NgModule } from '@angular/core';
import {
    MatAutocompleteModule,
    MatBadgeModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorIntl,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatStepperModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
} from '@angular/material';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { TranslateService } from '@ngx-translate/core';
import { PaginatorIntl } from '../material/paginator-intl';

/**
 * NgModule that includes all Material modules that are required.
 */

@NgModule({
    imports: [],
    declarations: [],
    exports: [
        MatAutocompleteModule,
        MatBadgeModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatCardModule,
        MatCheckboxModule,
        MatChipsModule,
        MatDatepickerModule,
        MatDialogModule,
        MatExpansionModule,
        MatIconModule,
        MatInputModule,
        MatListModule,
        MatMomentDateModule,
        MatPaginatorModule,
        MatProgressBarModule,
        MatProgressSpinnerModule,
        MatSelectModule,
        MatSidenavModule,
        MatSnackBarModule,
        MatTableModule,
        MatTooltipModule,
        MatTabsModule,
        MatToolbarModule,
        MatDividerModule,
        MatFormFieldModule,
        MatGridListModule,
        MatMenuModule,
        MatRadioModule,
        MatRippleModule,
        MatSlideToggleModule,
        MatSliderModule,
        MatSortModule,
        MatStepperModule,
        MatNativeDateModule,
        CdkTableModule,
        A11yModule,
        BidiModule,
        CdkAccordionModule,
        DragDropModule,
        ObserversModule,
        OverlayModule,
        PlatformModule,
        PortalModule
    ],
    providers: [{
        provide: MatPaginatorIntl,
        useFactory: (translate) => {
            const paginatorIntl = new PaginatorIntl();
            paginatorIntl.injectTranslateService(translate);
            return paginatorIntl;
        },
        deps: [TranslateService]
    }]
})
export class MaterialModule {
}
