import { TestBed } from '@angular/core/testing';

import { ProjectService } from './project.service';

describe('ProjectService', (): void => {
    beforeEach((): void => TestBed.configureTestingModule({}));

    it('should be created', (): void => {
        const service: ProjectService<any> = TestBed.inject(ProjectService);
        expect(service)
            .toBeTruthy();
    });
});
