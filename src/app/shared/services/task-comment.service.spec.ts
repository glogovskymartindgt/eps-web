import { TestBed } from '@angular/core/testing';

import { TaskCommentService } from './task-comment.service';

describe('TaskCommentService', (): void => {
    beforeEach((): void => TestBed.configureTestingModule({}));

    it('should be created', (): void => {
        const service: TaskCommentService = TestBed.inject(TaskCommentService);
        expect(service)
            .toBeTruthy();
    });
});
