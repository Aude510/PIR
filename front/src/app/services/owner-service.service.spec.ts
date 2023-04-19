import { TestBed } from '@angular/core/testing';

import { OwnerService } from './owner.service';

describe('OwnerServiceService', () => {
  let service: OwnerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OwnerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
