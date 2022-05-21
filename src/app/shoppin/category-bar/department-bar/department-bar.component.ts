import { Component, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { Category } from 'src/app/admin/category/category';
import { CategoryService } from 'src/app/admin/category/category.service';
import { CategoryTreeNode } from '../../../admin/category/CategoryTreeNode';
import SwiperCore, { Navigation } from 'swiper/core';
import { MyIdbService, STORE_SETTINGS_STORE, TS_STORE } from 'src/app/my-idb.service';
import { catRefreshTimeInMillis } from '../categories/categories.component';

SwiperCore.use([Navigation]);

@Component({
  selector: 'app-department-bar',
  templateUrl: './department-bar.component.html',
  styleUrls: ['./department-bar.component.scss'],
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
export class DepartmentBarComponent implements OnInit {

  categories: Array<Category>;
  categoryMenuItems: Array<CategoryTreeNode>;
  selectedCategoryId: string;
  isCategoryBarOpen: boolean = false;

  constructor(
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private dbService: MyIdbService,
    private router: Router
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params=>{
      this.selectedCategoryId = params['id'];
    });

    this.categoryService.getDepartments().subscribe(result=>{
      this.categories = result;
    });

    this.dbService.getValue(STORE_SETTINGS_STORE, "CAT_TREE").then(res=>{
      this.categories = res;
      // this.updateCategoryTree();
      if (!this.categories) {
        this.updateCategoryTree(); 
      } else {
        this.categoryMenuItems = res;
      }
    });
    this.dbService.getValue(TS_STORE, "CAT_TREE").then(res=>{
      if(res+catRefreshTimeInMillis<Date.now()){
        this.updateCategoryTree();
      }
    });
  }

  updateCategoryTree(){
    this.categoryService.fetchCategoryTree(true).subscribe(result => {
      this.categoryMenuItems = result;
      localStorage.setItem("catTree", JSON.stringify(result));
      this.dbService.setValue(STORE_SETTINGS_STORE, {"CAT_TREE": result});
      this.dbService.setValue(TS_STORE, {"CAT_TREE": Date.now()})
    });
  }

  open() {
    this.isCategoryBarOpen = true;
  }

  itemSelected(item){
    this.router.navigate(['/product-list'], {queryParams: {taxonomy: item.ancestors}});
  }

  navigateByDepartment(category){
    this.router.navigate(['/product-by-category'], {queryParams: category});
  }

}
