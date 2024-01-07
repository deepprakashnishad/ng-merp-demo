import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator'
import { MatTableDataSource } from '@angular/material/table'
import { MatSort } from '@angular/material/sort'

import { ProductService } from './product.service'
import { Product } from './product'

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  displayedColumns: string[] = ['name', 'attr', 'status', 'actions'];
  dataSource: MatTableDataSource<Product>;

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

	productList: Array<Product>=[]

  constructor(
  	private productService: ProductService
  ) { }

  ngOnInit() {
  	/*this.productService.getProducts().subscribe(products => {
      this.productList = products
      this.dataSource = new MatTableDataSource<Product>(this.productList)
      this.dataSource.paginator = this.paginator;
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
    })*/
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
