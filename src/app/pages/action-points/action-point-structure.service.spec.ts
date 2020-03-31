import { TestBed } from '@angular/core/testing';
import { ActionPointStructureService } from './action-point-structure.service';

describe('ActionPointStructureService', (): void => {
    beforeEach((): void => TestBed.configureTestingModule({}));

    it('should be created', (): void => {
        const service: ActionPointStructureService = TestBed.inject(ActionPointStructureService);
        expect(service)
            .toBeTruthy();
    });
});
