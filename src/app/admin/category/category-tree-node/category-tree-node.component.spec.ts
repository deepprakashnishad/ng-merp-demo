import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryTreeNodeComponent } from './category-tree-node.component';

describe('CategoryTreeNodeComponent', () => {
  let component: CategoryTreeNodeComponent;
  let fixture: ComponentFixture<CategoryTreeNodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategoryTreeNodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryTreeNodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
