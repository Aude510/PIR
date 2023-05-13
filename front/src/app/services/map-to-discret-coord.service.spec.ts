import { TestBed } from '@angular/core/testing';

import { MapToDiscretCoordService } from './map-to-discret-coord.service';

describe('MapToDiscretCoordService', () => {
  let service: MapToDiscretCoordService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MapToDiscretCoordService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
