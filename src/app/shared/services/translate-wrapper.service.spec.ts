import { TestBed } from '@angular/core/testing';

import { TranslateWrapperService } from './translate-wrapper.service';

describe('TranslateWrapperService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: TranslateWrapperService = TestBed.get(TranslateWrapperService);
        expect(service)
            .toBeTruthy();
    });
});
