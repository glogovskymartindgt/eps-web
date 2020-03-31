import { TestBed } from '@angular/core/testing';

import { RoutingStorageService } from './routing-storage.service';

describe('RoutingStorageService', (): void => {
    beforeEach((): void => TestBed.configureTestingModule({}));

    it('should be created', (): void => {
        const service: RoutingStorageService = TestBed.inject(RoutingStorageService);
        expect(service)
            .toBeTruthy();
    });
});
