import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditFacetComponent } from './add-edit-facet.component';

describe('AddEditFacetComponent', () => {
  let component: AddEditFacetComponent;
  let fixture: ComponentFixture<AddEditFacetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditFacetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditFacetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
