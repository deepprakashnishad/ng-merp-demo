/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SalePointComponent } from './sale-point.component';

describe('SalePointComponent', () => {
  let component: SalePointComponent;
  let fixture: ComponentFixture<SalePointComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalePointComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalePointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
