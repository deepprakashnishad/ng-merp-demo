import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/admin/product/product';
import { ProductService } from './../../product.service';

@Component({
  selector: 'app-product-by-category',
  templateUrl: './product-by-category.component.html',
  styleUrls: ['./product-by-category.component.scss']
})
export class ProductByCategoryComponent implements OnInit {

  selectedCategoryId: string;
  productsByCategory: any = {};

  products: Array<Product> = [];
  
  ancestors: string;
  slidesPerView = 4;
  isProductExists: boolean;

  categories: Map<string, string> = JSON.parse(localStorage.getItem("cat-map"))['catMap'];

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) { }

  ngOnInit() {
    console.log(this.categories);
  }

  ngAfterViewInit(): void {
    this.route.queryParams.subscribe(params=>{
      if(params['ancestors']){
        this.ancestors = params['ancestors'];
        this.getProductsByAncestors();
      }else if(params['id']){
        this.selectedCategoryId = params['id'];
        this.getProductListByCategoryId();
      }
    });
  }

  getProductListByCategoryId(){
    this.productService.getProductsByCategory(this.selectedCategoryId).subscribe(result=>{
      delete result['msg'];
      delete result['success'];
      this.products = Product.fromJSON(result);
    });
  }

  getCategoryWiseProductsByCategoryId(){
    this.productService.getProductsByCategory(this.selectedCategoryId).subscribe(result=>{
      delete result['msg'];
      delete result['success'];
      for (const [key, value] of Object.entries(result)) {
        var tempList = key.split("/");
        var finalKey = tempList.map(ele=>this.categories[ele]).join(" / ");
        this.productsByCategory[finalKey] = value;
      }

      if(this.productsByCategory && Object.keys(this.productsByCategory).length>0){
        this.isProductExists = true;
      }else{
        this.isProductExists = false;
      }
    });
  }

  getProductsByAncestors(){
    this.productService.getProductsByTaxonomy(this.ancestors).subscribe(result=>{
      delete result['msg'];
      delete result['success'];
      this.products = Product.fromJSON(result);
    });
  }
}
