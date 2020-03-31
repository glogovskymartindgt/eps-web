import { TestBed } from '@angular/core/testing';
import { ProjectAttachmentService } from './project-attachment.service';

describe('ProjectAttachmentService', (): void => {
    beforeEach((): void => TestBed.configureTestingModule({}));

    it('should be created', (): void => {
        const service: ProjectAttachmentService = TestBed.initTestEnvironment(ProjectAttachmentService);
        expect(service)
            .toBeTruthy();
    });
});
