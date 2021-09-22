import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/admin/product/product';
import { ProductService } from './../../product.service';

export const STRING_SEARCH = "STRING_SEARCH";
export const FILTER_SEARCH = "FILTER_SEARCH";

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {

  products: Array<Product> = [];

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params=>{
        this.loadProductsByCriteria(params);
    });
  }

  loadProductsByCriteria(criteria){
    this.productService.getByFilter(criteria).subscribe(result=>{
      this.products = result;
    });
  }
}
