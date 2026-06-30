import { TestBed } from '@angular/core/testing';

import { ArancelService } from './arancel.service';

describe('ArancelService', () => {
  let service: ArancelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArancelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
