import { Component, Input, OnInit, ViewChild } from '@angular/core';
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

  constructor(public router: Router) { }

  ngOnInit() {
  }

  itemSelected(item){
    this.router.navigate(['/product-list'], {queryParams:{taxonomy: item.ancestors}});
  }
}
