import { TestBed } from '@angular/core/testing';

import { AudioRecordsProviderService } from './audio-records-provider.service';

describe('AudioRecordsProviderService', () => {
  let service: AudioRecordsProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AudioRecordsProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
