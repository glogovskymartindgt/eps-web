import { TestBed } from '@angular/core/testing';

import { SelectedAreaService } from './selected-area.service';

describe('SelectedAreaService', (): void => {
    beforeEach((): void => TestBed.configureTestingModule({}));

    it('should be created', (): void => {
        const service: SelectedAreaService = TestBed.inject(SelectedAreaService);
        expect(service)
            .toBeTruthy();
    });
});
