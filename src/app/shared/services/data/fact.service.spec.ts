import { TestBed } from '@angular/core/testing';

import { FactService } from './fact.service';

describe('FactService', (): void => {
    beforeEach((): void => TestBed.configureTestingModule({}));

    it('should be created', (): void => {
        const service: FactService = TestBed.inject(FactService);
        expect(service)
            .toBeTruthy();
    });
});
