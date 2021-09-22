/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PickupPointComponent } from './pickup-point.component';

describe('PickupPointComponent', () => {
  let component: PickupPointComponent;
  let fixture: ComponentFixture<PickupPointComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PickupPointComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PickupPointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
