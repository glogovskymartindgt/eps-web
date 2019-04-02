import { TestBed } from '@angular/core/testing';

import { PhaseService } from './phase.service';

describe('PhaseService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PhaseService = TestBed.get(PhaseService);
    expect(service).toBeTruthy();
  });
});
