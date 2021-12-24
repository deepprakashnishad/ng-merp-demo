import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { debounceTime } from 'rxjs/operators';
import { ProductService } from './../product.service';
import { Store } from '../../store/store';
import { Product } from '../product';
import { get, set, getMany, setMany } from 'idb-keyval';
import { ITEM_STORE, MyIdbService, TS_STORE } from 'src/app/my-idb.service';

const productRefreshDays = 30;
const productRefreshTimeInMillis = productRefreshDays*24*60*60*1000;

@Component({
  selector: 'app-store-product-selector',
  templateUrl: './store-product-selector.component.html',
  styleUrls: ['./store-product-selector.component.scss']
})
export class StoreProductSelectorComponent implements OnInit {

  @Output() itemSelected: EventEmitter<any> = new EventEmitter();

  @Input() isInventoryEditable: boolean = true;
  @Input() isProductEditable: boolean = true;
  @Input() store: Store;

	cntl: FormControl = new FormControl();
	item: any;
	
	filteredItems: any[] = [];

  limit: number=30;
  offset: number=0;
  searchStr: string = "";

  selectedStore: Store;

  productList: Array<Product> = [];

  constructor(
    private productService: ProductService,
    private dbService: MyIdbService,
  ) { }

  ngOnInit() {
    this.cntl.valueChanges.pipe(debounceTime(500)).subscribe(val => {
      if(typeof val === "string" && val.length > 3){
        this.searchStr = val;
        this.offset = 0;
      }
  	});
  }

  ngOnChanges(changes: {[propKey: string]: SimpleChanges}): void {
    for (let propName in changes) {
      let changedProp = changes[propName];
      if(propName.toLowerCase() === "store" && changedProp.currentValue !== undefined){
        get("product_refresh_timestamp").then(val=>{
          if(val + productRefreshTimeInMillis<Date.now()){
            this.refreshStoreProductList();
          }
          this.refreshStoreProductList();
        });
      }
    }    
  }

  refreshStoreProductList(){
    if(this.store?.id==undefined || this.store?.id==null){
      return;
    }
    this.productService.getStoreFullProductList(this.store.id).subscribe(products => {
      var data = {};
      products.map(ele=>{
        data[ele.key] = ele;
      });
      this.dbService.setValue(ITEM_STORE, data);
      this.dbService.setValue(TS_STORE, {ITEM_STORE: Date.now()})
    });
  }

  displayFn(item?: any): string | undefined {
      return item ? item.name : undefined;
  }

  selected($event){
    this.item = $event.option.value;
    this.itemSelected.emit(this.item);
  }

}
