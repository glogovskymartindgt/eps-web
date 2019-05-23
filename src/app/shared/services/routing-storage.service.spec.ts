import { TestBed } from '@angular/core/testing';

import { RoutingStorageService } from './routing-storage.service';

describe('RoutingStorageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RoutingStorageService = TestBed.get(RoutingStorageService);
    expect(service).toBeTruthy();
  });
});
