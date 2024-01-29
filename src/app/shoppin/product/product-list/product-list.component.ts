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

  /*@HostListener("window:scroll", ["$event"])
  onWindowScroll() {
    //In chrome and some browser scroll is given to body tag
    let pos = (document.documentElement.scrollTop || document.body.scrollTop) + document.documentElement.offsetHeight;
    let max = document.documentElement.scrollHeight;
    // pos/max will give you the distance between scroll bottom and and bottom of screen in percentage.
    console.log(pos);
     if(pos == max )   {
     //Do your action here
     }
  }*/
}
