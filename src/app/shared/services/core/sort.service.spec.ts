import { TestBed } from '@angular/core/testing';
import { SortService } from './sort.service';

describe('SortService', (): void => {
  beforeEach((): void => TestBed.configureTestingModule({}));

  it('should be created', (): void => {
    const service: SortService = TestBed.initTestEnvironment(SortService);
    expect(service).toBeTruthy();
  });
});
