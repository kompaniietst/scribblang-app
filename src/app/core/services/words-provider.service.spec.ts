import { TestBed } from '@angular/core/testing';

import { WordsProviderService } from './words-provider.service';

describe('WordsProviderService', () => {
  let service: WordsProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WordsProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
