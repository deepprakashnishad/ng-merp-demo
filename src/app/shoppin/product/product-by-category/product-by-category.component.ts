import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from './../../product.service';

@Component({
  selector: 'app-product-by-category',
  templateUrl: './product-by-category.component.html',
  styleUrls: ['./product-by-category.component.scss']
})
export class ProductByCategoryComponent implements OnInit {

  selectedCategoryId: string;
  productsByCategory: any;
  slidesPerView = 4;
  isProductExists: boolean;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params=>{
      this.selectedCategoryId = params['id'];
      this.getProductsByCategory();
    });
  }

  getProductsByCategory(){
    this.productService.getProductsByCategory(this.selectedCategoryId).subscribe(result=>{
      delete result['success'];
      delete result['msg'];
      this.productsByCategory = result;
      if(this.productsByCategory && Object.keys(this.productsByCategory).length>0){
        this.isProductExists = true;
      }else{
        this.isProductExists = false;
      }
    });
  }

}
