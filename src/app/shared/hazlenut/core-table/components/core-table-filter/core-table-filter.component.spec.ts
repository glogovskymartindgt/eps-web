import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TRANSLATE_WRAPPER_TOKEN } from '../../../hazelnut-common/interfaces/translate.interface';
import { NoopTranslationsService } from '../../../hazelnut-common/services/testing/noop-translation.service';
import { GLOBAL_CONFIG_TOKEN } from '../../core-table-config.interface';

import { NOTIFICATION_WRAPPER_TOKEN } from '../../../small-components/notifications';
import { NoopNotificationService } from '../../../small-components/notifications/testing/noop-notification.service';
import { CoreTableModule } from '../../core-table.module';
import { CoreTableService } from '../../core-table.service';
import { CoreTableFilterComponent } from './core-table-filter.component';

describe('CoreTableFilterComponent', () => {
    let component: CoreTableFilterComponent;
    let fixture: ComponentFixture<CoreTableFilterComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreTableModule,
            ],
            providers: [
                CoreTableService,
                {provide: TRANSLATE_WRAPPER_TOKEN, useClass: NoopTranslationsService},
                {provide: NOTIFICATION_WRAPPER_TOKEN, useClass: NoopNotificationService},
                {provide: GLOBAL_CONFIG_TOKEN, useValue: {}},
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CoreTableFilterComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
