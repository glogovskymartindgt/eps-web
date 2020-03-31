import { TestBed } from '@angular/core/testing';

import { NotificationService } from './notification.service';

describe('NotificationService', (): void => {
    beforeEach((): void => TestBed.configureTestingModule({}));

    it('should be created', (): void => {
        const service: NotificationService = TestBed.inject(NotificationService);
        expect(service)
            .toBeTruthy();
    });
});
