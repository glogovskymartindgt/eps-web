import { TestBed } from '@angular/core/testing';

import { TableChangeStorageService } from './table-change-storage.service';

describe('TableChangeStorageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TableChangeStorageService = TestBed.get(TableChangeStorageService);
    expect(service).toBeTruthy();
  });
});
