import { trigger, state, style, transition, animate } from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { MyIdbService, STORE_SETTINGS_STORE, TS_STORE } from 'src/app/my-idb.service';
import { Category } from '../../admin/category/category';
import { CategoryService } from '../../admin/category/category.service';
import { CategoryTreeNode } from '../../admin/category/CategoryTreeNode';
import { catRefreshTimeInMillis } from './categories/categories.component';

@Component({
  selector: 'app-category-bar',
  templateUrl: './category-bar.component.html',
  styleUrls: ['./category-bar.component.scss'],
  animations: [
		trigger('openClose', [
			state('open', style({
				opacity: 1,
				transform: 'translateX(0%)'
			})),
			state('closed', style({
				opacity: 0,
				transform: 'translateX(100%)'
			})),
			transition('open => closed', [
				animate('300ms')
			]),
			transition('closed => open', [
				animate('300ms')
			]),
		])
	]
})
export class CategoryBarComponent implements OnInit {

  categories: Array<CategoryTreeNode>;
  isCategoryBarOpen: boolean = false;
  @Input("navigateOnSelection") navigateOnSelection = true;

  @Output("categorySelected") categorySelected: EventEmitter<any> = new EventEmitter();

  constructor(
    private categoryService: CategoryService,
    private dbService: MyIdbService,
    private router: Router
  ) { 
  }

  ngOnInit() {
    this.dbService.getValue(STORE_SETTINGS_STORE, "CAT_TREE").then(res=>{
      this.categories = res;
      // this.updateCategoryTree();
      if (!this.categories) {
        this.updateCategoryTree(); 
      } else {
        this.categories = res;
      }
    });
    this.dbService.getValue(TS_STORE, "CAT_TREE").then(res=>{
      if(res+catRefreshTimeInMillis<Date.now()){
        this.updateCategoryTree();
      }
    })
  }

  updateCategoryTree(){
    this.categoryService.fetchCategoryTree(true).subscribe(result => {
      this.categories = result;
      sessionStorage.setItem("catTree", JSON.stringify(result));
      this.dbService.setValue(STORE_SETTINGS_STORE, {"CAT_TREE": result});
      this.dbService.setValue(TS_STORE, {"CAT_TREE": Date.now()})
    });
  }

  toggleCategoryDrawer(){

  }

  open(){
    this.isCategoryBarOpen = true;
  }

  itemSelected(item) {
    if (this.navigateOnSelection) {
      this.router.navigate(['/product-list'], { queryParams: { taxonomy: item.ancestors } });
    } else {
      this.categorySelected.emit(item);
    }
  }
}
