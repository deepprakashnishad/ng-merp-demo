import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryChipInputComponent } from './category-chip-input.component';

describe('CategoryChipInputComponent', () => {
  let component: CategoryChipInputComponent;
  let fixture: ComponentFixture<CategoryChipInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategoryChipInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryChipInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
