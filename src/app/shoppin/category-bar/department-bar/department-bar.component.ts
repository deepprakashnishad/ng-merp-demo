import { Component, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { Category } from 'src/app/admin/category/category';
import { CategoryService } from 'src/app/admin/category/category.service';
import { CategoryTreeNode } from '../../../admin/category/CategoryTreeNode';
import SwiperCore, { Navigation } from 'swiper/core';

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
    private router: Router
  ) { }

  ngOnInit() {

    this.route.queryParams.subscribe(params=>{
      this.selectedCategoryId = params['id'];
    });

    this.categoryService.getDepartments().subscribe(result=>{
      this.categories = result;
    });

    this.categoryService.fetchCategoryTree(true, true).subscribe(result=>{
      this.categoryMenuItems = result;      
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
