import { TestBed } from '@angular/core/testing';

import { TaskService } from './task.service';

describe('TaskService', (): void => {
    beforeEach((): void => TestBed.configureTestingModule({}));

    it('should be created', (): void => {
        const service: TaskService = TestBed.inject(TaskService);
        expect(service)
            .toBeTruthy();
    });
});
