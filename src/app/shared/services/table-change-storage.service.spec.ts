import { TestBed } from '@angular/core/testing';

import { TableChangeStorageService } from './table-change-storage.service';

describe('TableChangeStorageService', (): void => {
    beforeEach((): void => TestBed.configureTestingModule({}));

    it('should be created', (): void => {
        const service: TableChangeStorageService = TestBed.inject(TableChangeStorageService);
        expect(service)
            .toBeTruthy();
    });
});
