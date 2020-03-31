import { TestBed } from '@angular/core/testing';

import { AttachmentService } from './attachment.service';

describe('AttachmentService', (): void => {
    beforeEach((): void => TestBed.configureTestingModule({}));

    it('should be created', (): void => {
        const service: AttachmentService = TestBed.inject(AttachmentService);
        expect(service)
            .toBeTruthy();
    });
});
