import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatMenu } from '@angular/material/menu';
import { Router } from '@angular/router';
import { CategoryTreeNode } from 'src/app/admin/category/CategoryTreeNode';

@Component({
  selector: 'app-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.scss']
})
export class MenuItemComponent implements OnInit {

  @Input() items: CategoryTreeNode[];
  @ViewChild('childMenu', {static: true}) public childMenu: MatMenu;

  @Input("navigateOnSelection") navigateOnSelection = true;

  @Output("categorySelected") categorySelected: EventEmitter<any> = new EventEmitter();

  constructor(public router: Router) { }

  ngOnInit() {
  }

  itemSelected(item){
    if (this.navigateOnSelection) {
      this.router.navigate(['/product-list'], { queryParams: { taxonomy: item.ancestors } });
    } else {
      this.categorySelected.emit(item);
    }
    // this.router.navigate(['/product-list'], {queryParams:{taxonomy: item.ancestors}});
  }
}
