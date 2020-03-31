import { TestBed } from '@angular/core/testing';
import { FileService } from './file.service';

describe('FileService', (): void => {
  beforeEach((): void => TestBed.configureTestingModule({}));

  it('should be created', (): void => {
    const service: FileService = TestBed.inject(FileService);
    expect(service).toBeTruthy();
  });
});
