import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { concat } from 'rxjs';
import { Category } from '../../category/category';
import { CategoryTreeNode } from '../../category/CategoryTreeNode';
import { Product } from '../product';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-product-selector',
  templateUrl: './product-selector.component.html',
  styleUrls: ['./product-selector.component.scss']
})
export class ProductSelectorComponent implements OnInit {

  products: Array<Product>;
  selectedProductIds: Array<String> = [];

  constructor(
    public dialogRef: MatDialogRef<ProductSelectorComponent>,
    private productService: ProductService,
    private notifier: NotifierService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { 
    this.selectedProductIds = this.data.section.productIds;
  }

  ngOnInit() {
    this.productService.getProducts().subscribe(products=>{
      this.products = products;
    });
  }

  productSelectionChanged(isSelected, productId){
    let index = this.selectedProductIds.indexOf(productId);
    if(isSelected && index==-1){
      this.selectedProductIds.push(productId);
    }else if(index>-1){
      this.selectedProductIds.splice(index, 1);
    };
  }

  categoryUpdated(categoryNode) {
    this.productService.getProductsByCategory(categoryNode.category).subscribe(result => {
      delete result['success'];
      delete result['msg'];
      this.products = [];
      var keys = Object.keys(result);
      for (let key of keys) {
        this.products = this.products.concat(result[key]);
      }
      //this.products = result;
      //if (this.products && Object.keys(this.products).length > 0) {
      //  this.isProductExists = true;
      //} else {
      //  this.isProductExists = false;
      //}
    });
  }

  isProductSelected(productId){
    return this.selectedProductIds.indexOf(productId) > -1;
  }
}
