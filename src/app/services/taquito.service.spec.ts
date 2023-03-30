import { TestBed } from '@angular/core/testing';

import { TaquitoService } from './taquito.service';

describe('TaquitoService', () => {
  let service: TaquitoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaquitoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
