import { TestBed } from '@angular/core/testing';

import { SettingsService } from './settings.service';

describe('SettingsService', (): void => {
    beforeEach((): void => TestBed.configureTestingModule({}));

    it('should be created', (): void => {
        const service: SettingsService = TestBed.inject(SettingsService);
        expect(service)
            .toBeTruthy();
    });
});
