import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacetChipInputComponent } from './facet-chip-input.component';

describe('FacetChipInputComponent', () => {
  let component: FacetChipInputComponent;
  let fixture: ComponentFixture<FacetChipInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FacetChipInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacetChipInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
