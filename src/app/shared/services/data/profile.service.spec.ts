import { TestBed } from '@angular/core/testing';

import { ProfileService } from './profile.service';

describe('ProfileServiceService', (): void => {
    beforeEach((): void => TestBed.configureTestingModule({}));

    it('should be created', (): void => {
        const service: ProfileService = TestBed.inject(ProfileService);
        expect(service)
            .toBeTruthy();
    });
});
