import { TestBed } from '@angular/core/testing';

import { ActionPointService } from './action-point.service';

describe('ActionPointService', (): void => {
    beforeEach((): void => TestBed.configureTestingModule({}));

    it('should be created', (): void => {
        const service: ActionPointService = TestBed.inject(ActionPointService);
        expect(service)
            .toBeTruthy();
    });
});
