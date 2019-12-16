import { TestBed } from '@angular/core/testing';

import { ProjectService } from './project.service';

describe('ProjectService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: ProjectService<any> = TestBed.get(ProjectService);
        expect(service)
            .toBeTruthy();
    });
});
