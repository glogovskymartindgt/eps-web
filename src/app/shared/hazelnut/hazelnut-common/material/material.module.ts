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
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
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
