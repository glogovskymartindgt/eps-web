import { TestBed } from '@angular/core/testing';

import { ProjectAttachmentService } from './project-attachment.service';

describe('ProjectAttachmentService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: ProjectAttachmentService = TestBed.get(ProjectAttachmentService);
        expect(service)
            .toBeTruthy();
    });
});
