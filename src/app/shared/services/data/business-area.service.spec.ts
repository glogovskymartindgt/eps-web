import { TestBed } from '@angular/core/testing';

import { BusinessAreaService } from './business-area.service';

describe('BusinessAreaService', (): void => {
    beforeEach((): void => TestBed.configureTestingModule({}));

    it('should be created', (): void => {
        const service: BusinessAreaService = TestBed.inject(BusinessAreaService);
        expect(service)
            .toBeTruthy();
    });
});
