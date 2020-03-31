import { TestBed } from '@angular/core/testing';

import { ProjectsService } from './projects.service';

describe('ProjectsService', (): void => {
    beforeEach((): void => TestBed.configureTestingModule({}));

    it('should be created', (): void => {
        const service: ProjectsService = TestBed.inject(ProjectsService);
        expect(service)
            .toBeTruthy();
    });
});
