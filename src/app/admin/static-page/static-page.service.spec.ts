/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { StaticPageService } from './static-page.service';

describe('Service: StaticPage', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StaticPageService]
    });
  });

  it('should ...', inject([StaticPageService], (service: StaticPageService) => {
    expect(service).toBeTruthy();
  }));
});
