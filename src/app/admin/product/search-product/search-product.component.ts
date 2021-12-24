import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { elementAt } from 'rxjs-compat/operator/elementAt';
import { startWith, map, debounceTime } from 'rxjs/operators';
import { PriceComponent } from '../price/price.component';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-search-product',
  templateUrl: './search-product.component.html',
  styles: [".brand{font-size: small; font-color: grey}"]
})
export class SearchProductComponent implements OnInit {

  @Output() itemSelected: EventEmitter<any> = new EventEmitter();

  @Input() isInventoryEditable: boolean = true;
  @Input() isProductEditable: boolean = true;

	cntl: FormControl = new FormControl();
	item: any;
	
	filteredItems: any[] = [];

  limit: number=30;
  offset: number=0;
  searchStr: string = "";

  constructor(
    private productService: ProductService,
    private router: Router,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.cntl.valueChanges.pipe(debounceTime(500)).subscribe(val => {
      if(typeof val === "string" && val.length > 3){
        this.searchStr = val;
        this.offset = 0;
        this.fetchProductList();
      }
  	});
  }

  fetchProductList(){
    this.productService.getBySearchText(this.searchStr)
    .subscribe((items)=>{
      if(this.filteredItems.length===0){
        this.filteredItems = items;
      }else{
        this.filteredItems = this.filteredItems.concat(items);
        this.filteredItems = this.filteredItems.filter((elem, index, self) => {
          console.log(elem);
          return index === self.indexOf(elem) && elem?.name?.toLowerCase().includes(this.searchStr);
        });
      }
    });
  }

  displayFn(item?: any): string | undefined {
      return item ? item.name : undefined;
  }

  selected($event){
    this.item = $event.option.value;
    this.itemSelected.emit(this.item);
  }

  editInventory(item){
    this.dialog.open(PriceComponent, {
      data: {
        productId: item.id,
        itemId: item.id,
        priceType: "PRD"
      }
    })
  }

  editProduct(item){
    console.log(`/admin/product/edit/${item.id}`);
    this.router.navigate([`/admin/product/edit/${item.id}`]);
  }
}

