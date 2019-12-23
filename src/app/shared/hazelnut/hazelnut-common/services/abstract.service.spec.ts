import { TestBed } from '@angular/core/testing';
import { NOTIFICATION_WRAPPER_TOKEN } from '@hazelnut';
import { NoopNotificationService } from '@hazelnut/lib/small-components/notifications/testing/noop-notification.service';
import { TestingModule } from '@hazelnut/lib/testing.module';
import { AbstractService } from './abstract.service';

describe('AbstractService', () => {
    beforeEach(() => TestBed.configureTestingModule({
        imports: [
            TestingModule,
        ],
        providers: [
            AbstractService,
            {provide: NOTIFICATION_WRAPPER_TOKEN, useClass: NoopNotificationService},
            {provide: String, useValue: 'something'},
        ]
    }));

    it('should be created', () => {
        const service: AbstractService = TestBed.get(AbstractService);
        expect(service).toBeTruthy();
    });
});
