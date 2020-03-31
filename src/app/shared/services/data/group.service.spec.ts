import { TestBed } from '@angular/core/testing';

import { GroupService } from './group.service';

describe('GroupService', (): void => {
    beforeEach((): void => TestBed.configureTestingModule({}));

    it('should be created', (): void => {
        const service: GroupService = TestBed.inject(GroupService);
        expect(service)
            .toBeTruthy();
    });
});
