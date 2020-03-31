import { TestBed } from '@angular/core/testing';

import { EventService } from './event.service';

describe('EventService', (): void => {
    beforeEach((): void => TestBed.configureTestingModule({}));

    it('should be created', (): void => {
        const service: EventService<any> = TestBed.inject(EventService);
        expect(service)
            .toBeTruthy();
    });
});
