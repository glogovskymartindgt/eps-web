import { TestBed } from '@angular/core/testing';

import { ProjectUserService } from './project-user.service';

describe('ProjectUserService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: ProjectUserService = TestBed.get(ProjectUserService);
        expect(service)
            .toBeTruthy();
    });
});
