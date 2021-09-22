import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacetControlComponent } from './facet-control.component';

describe('FacetControlComponent', () => {
  let component: FacetControlComponent;
  let fixture: ComponentFixture<FacetControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FacetControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacetControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
