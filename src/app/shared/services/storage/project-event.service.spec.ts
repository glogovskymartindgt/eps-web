import { TestBed } from '@angular/core/testing';

import { ProjectEventService } from './project-event.service';

describe('ProjectEventService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProjectEventService = TestBed.get(ProjectEventService);
    expect(service).toBeTruthy();
  });
});
