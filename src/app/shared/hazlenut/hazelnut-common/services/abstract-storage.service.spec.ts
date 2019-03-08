import { TestBed } from '@angular/core/testing';

import { AbstractStorageService } from './abstract-storage.service';

describe('StorageService', () => {
    beforeEach(() => TestBed.configureTestingModule({
        providers: [
            AbstractStorageService,
        ]
    }));

    it('should be created', () => {
        const service: AbstractStorageService = TestBed.get(AbstractStorageService);
        expect(service).toBeTruthy();
    });
});
