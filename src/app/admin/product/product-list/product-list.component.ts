import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import {SelectionModel} from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

import { ProductService } from './../product.service';
import { Product } from './../product';
import { NotifierService } from 'angular-notifier';
import { StorageService } from '../../../storage.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent {

  displayedColumns: string[] = ['name', 'brand', 'price', 'qty', 'taxonomies', 'attr', 'status', 'actions', 'select'];
  dataSource: MatTableDataSource<Product>;

  selection = new SelectionModel<Product>(true, []);

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  productList: Array<Product> = [];

  constructor(
  	private productService: ProductService,
    private notifierService: NotifierService,
    private storageService: StorageService
  ) {
    if (!this.storageService.getValueFromStoreSettings("isBrandEnabled")) {
      this.displayedColumns.splice(1, 1);
    }
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    this.productService.getProducts().subscribe(products => {
      this.productList = products;
      this.dataSource = new MatTableDataSource<Product>(this.productList)
      this.dataSource.filterPredicate = ((item, filter):boolean=>{
        return item.name.toLowerCase().includes(filter) || 
          item.brand.sname.includes(filter) ||
          item.lname.toLowerCase().includes(filter)
      })
      this.dataSource.sortingDataAccessor = (item, property) => {
        switch(property) {
          case 'name': return item.name;
          default: return item[property];
        }
      };
      this.dataSource.sort = this.sort;
    });
  }

  sortData(sort: MatSort) { this.dataSource.sort = this.sort; }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  selectionToggle(event, product: Product){
    if(event.checked && product.assets?.imgs?.length<1){
      this.notifierService.notify("error", "Product images are missing");
      return;
    }

    if((event.checked && product.status.toLowerCase()==="active") || 
      (!event.checked && product.status.toLowerCase()==="inactive")){
        return;
    }
    product.status = event.checked?"Active":"Inactive";
    this.productService.updateProduct(product).subscribe(result=>{
      if(result['success']){
        this.notifierService.notify("success", `${product.name} status changed to ${product.status}`);
      }
    });
  }

  delete(product: Product){
    this.productService.deleteProduct(product.id).subscribe(result=>{
      if(result['success']){
        this.notifierService.notify("success", "Product deleted successfully");
      }else{
        this.notifierService.notify("error", "Product could not be deleted");
      }
    });
  }

}
