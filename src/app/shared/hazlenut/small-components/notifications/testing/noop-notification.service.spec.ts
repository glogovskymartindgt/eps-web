import { TestBed } from '@angular/core/testing';

import { NoopNotificationService } from './noop-notification.service';

describe('NoopNotificationService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: NoopNotificationService = TestBed.get(NoopNotificationService);
        expect(service)
            .toBeTruthy();
    });
});
