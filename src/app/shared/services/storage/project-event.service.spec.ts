import { TestBed } from '@angular/core/testing';

import { ProjectEventService } from './project-event.service';

describe('ProjectEventService', (): void => {
    beforeEach((): void => TestBed.configureTestingModule({}));

    it('should be created', (): void => {
        const service: ProjectEventService = TestBed.inject(ProjectEventService);
        expect(service)
            .toBeTruthy();
    });
});
