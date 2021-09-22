import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacetValueComponent } from './facet-value.component';

describe('FacetValueComponent', () => {
  let component: FacetValueComponent;
  let fixture: ComponentFixture<FacetValueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FacetValueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacetValueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
