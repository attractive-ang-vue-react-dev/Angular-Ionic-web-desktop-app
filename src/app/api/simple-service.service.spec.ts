import { TestBed } from '@angular/core/testing';

import { SimpleServiceService } from './simple-service.service';

describe('SimpleServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SimpleServiceService = TestBed.get(SimpleServiceService);
    expect(service).toBeTruthy();
  });
});
