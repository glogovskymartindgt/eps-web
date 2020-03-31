import { TestBed } from '@angular/core/testing';
import { UserService } from './user.service';

describe('UserService', (): void => {
    beforeEach((): void => TestBed.configureTestingModule({}));

    it('should be created', (): void => {
        const service: UserService = TestBed.inject(UserService);
        expect(service)
            .toBeTruthy();
    });
});
