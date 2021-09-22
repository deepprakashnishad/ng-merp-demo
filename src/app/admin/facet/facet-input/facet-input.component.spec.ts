import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacetInputComponent } from './facet-input.component';

describe('FacetInputComponent', () => {
  let component: FacetInputComponent;
  let fixture: ComponentFixture<FacetInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FacetInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacetInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
