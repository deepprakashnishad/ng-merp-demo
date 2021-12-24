/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { MyIdbService } from './my-idb.service';

describe('Service: MyIdb', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MyIdbService]
    });
  });

  it('should ...', inject([MyIdbService], (service: MyIdbService) => {
    expect(service).toBeTruthy();
  }));
});
