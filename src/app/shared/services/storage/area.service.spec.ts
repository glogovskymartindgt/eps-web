import { TestBed } from '@angular/core/testing';

import { AreaService } from './area.service';

describe('AreaService', (): void => {
    beforeEach((): void => TestBed.configureTestingModule({}));

    it('should be created', (): void => {
        const service: AreaService<any> = TestBed.inject(AreaService);
        expect(service)
            .toBeTruthy();
    });
});
