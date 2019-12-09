import { TestBed } from '@angular/core/testing';

import { ActionPointService } from './action-point.service';

describe('ActionPointService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ActionPointService = TestBed.get(ActionPointService);
    expect(service).toBeTruthy();
  });
});
