import { TestBed } from '@angular/core/testing';

import { DashboardService } from './dashboard.service';

describe('DashboardService', (): void => {
    beforeEach((): void => TestBed.configureTestingModule({}));

    it('should be created', (): void => {
        const service: DashboardService = TestBed.inject(DashboardService);
        expect(service)
            .toBeTruthy();
    });
});
