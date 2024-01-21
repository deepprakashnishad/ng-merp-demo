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
  displayedProducts: Array<Product>;
  selectedProductIds: Array<String> = [];
  filterText: string="";

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
      this.displayedProducts = products;
    });
  }

  search(){
    this.productService.getByFilter({text: this.filterText}).subscribe(products=>{
      this.products = products;
      this.displayedProducts = products;
    })
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
    this.displayedProducts = this.products.filter(ele=>{
      return ele.taxonomies?.some(m=>m.indexOf(categoryNode.id)>-1)
    });
  }

  isProductSelected(productId){
    return this.selectedProductIds.indexOf(productId) > -1;
  }

  query(event){
    console.log(event);
  }
}
