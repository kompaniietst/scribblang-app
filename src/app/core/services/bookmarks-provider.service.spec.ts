import { TestBed } from '@angular/core/testing';

import { BookmarksProviderService } from './bookmarks-provider.service';

describe('BookmarksProviderService', () => {
  let service: BookmarksProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BookmarksProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
