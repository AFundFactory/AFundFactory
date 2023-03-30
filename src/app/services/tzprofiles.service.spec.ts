import { TestBed } from '@angular/core/testing';

import { TzprofilesService } from './tzprofiles.service';

describe('TzprofilesService', () => {
  let service: TzprofilesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TzprofilesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
