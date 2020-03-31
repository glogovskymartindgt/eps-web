import { TestBed } from '@angular/core/testing';

import { PhaseService } from './phase.service';

describe('PhaseService', (): void => {
    beforeEach((): void => TestBed.configureTestingModule({}));

    it('should be created', (): void => {
        const service: PhaseService = TestBed.inject(PhaseService);
        expect(service)
            .toBeTruthy();
    });
});
