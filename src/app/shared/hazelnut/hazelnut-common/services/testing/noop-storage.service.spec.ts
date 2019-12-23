import { TestBed } from '@angular/core/testing';

import { NoopStorageService } from './noop-storage.service';

describe('NoopStorageService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: NoopStorageService = TestBed.get(NoopStorageService);
        expect(service).toBeTruthy();
    });
});
