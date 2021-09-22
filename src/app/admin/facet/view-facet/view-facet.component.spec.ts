import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewFacetComponent } from './view-facet.component';

describe('ViewFacetComponent', () => {
  let component: ViewFacetComponent;
  let fixture: ComponentFixture<ViewFacetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewFacetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewFacetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
