import { TestBed } from '@angular/core/testing';

import { ActionPointStructureService } from './action-point-structure.service';

describe('ActionPointStructureService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: ActionPointStructureService = TestBed.get(ActionPointStructureService);
        expect(service)
            .toBeTruthy();
    });
});
