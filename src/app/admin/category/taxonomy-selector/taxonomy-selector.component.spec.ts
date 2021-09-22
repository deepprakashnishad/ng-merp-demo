import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxonomySelectorComponent } from './taxonomy-selector.component';

describe('TaxonomySelectorComponent', () => {
  let component: TaxonomySelectorComponent;
  let fixture: ComponentFixture<TaxonomySelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaxonomySelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaxonomySelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
