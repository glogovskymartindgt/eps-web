import { TestBed } from '@angular/core/testing';

import { ProjectUserService } from './project-user.service';

describe('ProjectUserService', (): void => {
    beforeEach((): void => TestBed.configureTestingModule({}));

    it('should be created', (): void => {
        const service: ProjectUserService = TestBed.inject(ProjectUserService);
        expect(service)
            .toBeTruthy();
    });
});
