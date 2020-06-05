import { TestBed } from '@angular/core/testing';

import { CommentService } from './comment.service';

describe('CommentService', (): void => {
    beforeEach((): void => {
    });

    it('should be created', (): void => {
        const service: CommentService = TestBed.inject(CommentService);
        expect(service)
            .toBeTruthy();
    });
});
