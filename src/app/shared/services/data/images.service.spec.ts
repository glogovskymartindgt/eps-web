import { TestBed } from '@angular/core/testing';

import { ImagesService } from './images.service';

describe('ImagesService', (): void => {
    beforeEach((): void => TestBed.configureTestingModule({}));

    it('should be created', (): void => {
        const service: ImagesService = TestBed.inject(ImagesService);
        expect(service)
            .toBeTruthy();
    });
});
