import { TestBed } from '@angular/core/testing';

import { FileSystemProviderService } from './file-system-provider.service';

describe('FileSystemProviderService', () => {
  let service: FileSystemProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FileSystemProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
