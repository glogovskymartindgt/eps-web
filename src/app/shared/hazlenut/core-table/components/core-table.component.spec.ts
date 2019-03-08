import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopNotificationService } from '@hazelnut/lib/small-components/notifications/testing/noop-notification.service';
import { TestingModule } from '@hazelnut/lib/testing.module';
import { NoopTranslationsService } from '../../hazelnut-common/services/testing/noop-translation.service';

import { CoreTableModule } from '../core-table.module';
import { CoreTableComponent } from './core-table.component';

describe('CoreTableComponent', () => {
    let component: CoreTableComponent;
    let fixture: ComponentFixture<CoreTableComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                CoreTableModule,
                TestingModule,
            ],
            providers: [
                NoopTranslationsService,
                NoopNotificationService,
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CoreTableComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
