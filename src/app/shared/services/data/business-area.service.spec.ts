import { TestBed } from '@angular/core/testing';

import { BusinessAreaService } from './business-area.service';

describe('BusinessAreaService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: BusinessAreaService = TestBed.get(BusinessAreaService);
        expect(service)
            .toBeTruthy();
    });
});
