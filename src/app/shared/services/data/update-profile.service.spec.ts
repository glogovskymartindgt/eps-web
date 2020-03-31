import { TestBed } from '@angular/core/testing';
import { UpdateProfileService } from './update-profile.service';

describe('UpdateProfileService', (): void => {
    beforeEach((): void => TestBed.configureTestingModule({}));

    it('should be created', (): void => {
        const service: UpdateProfileService = TestBed.inject(UpdateProfileService);
        expect(service)
            .toBeTruthy();
    });
});
