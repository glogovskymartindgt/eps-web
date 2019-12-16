import { TestBed } from '@angular/core/testing';

import { SelectedAreaService } from './selected-area.service';

describe('SelectedAreaService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: SelectedAreaService = TestBed.get(SelectedAreaService);
        expect(service)
            .toBeTruthy();
    });
});
