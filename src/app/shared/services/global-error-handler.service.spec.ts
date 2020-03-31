import { TestBed } from '@angular/core/testing';

import { GlobalErrorHandlerService } from './global-error-handler.service';

describe('GlobalErrorHandlerService', (): void => {
    beforeEach((): void => TestBed.configureTestingModule({}));

    it('should be created', (): void => {
        const service: GlobalErrorHandlerService = TestBed.inject(GlobalErrorHandlerService);
        expect(service)
            .toBeTruthy();
    });
});
