import { TestBed } from '@angular/core/testing';

import { ReportService } from './report.service';

describe('ReportService', (): void => {
    beforeEach((): void => TestBed.configureTestingModule({}));

    it('should be created', (): void => {
        const service: ReportService = TestBed.inject(ReportService);
        expect(service)
            .toBeTruthy();
    });
});
