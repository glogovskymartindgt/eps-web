import { TestBed } from '@angular/core/testing';

import { TranslateWrapperService } from './translate-wrapper.service';

describe('TranslateWrapperService', (): void => {
    beforeEach((): void => TestBed.configureTestingModule({}));

    it('should be created', (): void => {
        const service: TranslateWrapperService = TestBed.inject(TranslateWrapperService);
        expect(service)
            .toBeTruthy();
    });
});
