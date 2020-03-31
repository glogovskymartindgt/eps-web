import { TestBed } from '@angular/core/testing';

import { VenueService } from './venue.service';

describe('VenueService', (): void => {
    beforeEach((): void => TestBed.configureTestingModule({}));

    it('should be created', (): void => {
        const service: VenueService = TestBed.inject(VenueService);
        expect(service)
            .toBeTruthy();
    });
});
