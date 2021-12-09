import { Component, OnInit, Input, Output, SimpleChange } from '@angular/core';
import { PriceService } from './../price.service';
import { SaleDetail } from './../sale-detail';
import { Store } from './../../store/store'
import { Price } from './../price';
import { ProductService } from '../product.service';
import { NotifierService } from 'angular-notifier';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-price',
  templateUrl: './price.component.html',
  styleUrls: ['./price.component.scss']
})
export class PriceComponent implements OnInit {

  @Input()
  priceType: string;

  @Input()
  productId: string;

	@Input()
	itemId: string;

  sku: string;

	index: number;

	store: Store;
	costPrice: number=0.0;
	sellPrice: number;
	inStockQty: number;
  maxAlwdQty: number = 99;
	currency: string="INR";
	saleDetail: SaleDetail = new SaleDetail();
	saleDetailList: SaleDetail[];
	price:Price;
	minDate = new Date();
  saleDetailSelectedIndex: number = -1;

  dataSource: MatTableDataSource<SaleDetail> = new MatTableDataSource();

  displayedColumns: string[] = ['mrp', 'discount', 'discountPercent', 'minQty', 'status', 'actions'];

  constructor(
    private priceService: PriceService,
    private notifier: NotifierService
  ) { }

  ngOnInit() {
  	this.saleDetailList=[];
  }

  ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
  	for (let propName in changes) {
	    let changedProp = changes[propName];
	    if (propName === "itemId") {
        this.itemId = changedProp.currentValue;
	    }else if(propName === "priceType"){
        this.priceType = changedProp.currentValue;
      }
      if((this.priceType==="PRD" ||this.priceType==="VRT") && this.itemId && this.store){
        this.fetchPrice();
      }else{
        this.notifier.notify("error", "Invalid data");
      }
	  }
  }

  fetchPrice(){
    this.priceService.getPriceById(this.priceType, this.itemId, this.store.id)
    .subscribe(result=>{
      if(result.length){
        this.price = result[0];
        this.populatePrice();
      }
    });
  }

  storeSelected(event){
  	this.store = event;
    this.fetchPrice();
  }

  populatePrice(){
    this.saleDetailList = this.price.discounts;
    this.inStockQty = this.price.qty;
    this.maxAlwdQty = this.price.maxAlldQty;
    this.sellPrice = this.price.unitPrice;
    this.sku = this.price.sku;

    this.dataSource.data = this.saleDetailList;
  }

  acceptSaleDetailChanges(){
    if(this.saleDetailList ===null || this.saleDetailList === undefined){
      this.saleDetailList = [];
    }
    if(this.saleDetailSelectedIndex === -1){
      this.saleDetailList.push(this.saleDetail);
    }else{
      this.saleDetailList[this.saleDetailSelectedIndex] = this.saleDetail;
    }

    this.resetSaleDetail();
  }

  editSaleDetail(saleDetail, index){
    this.saleDetailSelectedIndex = index;
    this.saleDetail = saleDetail;
  }

  deleteSaleDetail(saleDetail, index){
  	this.saleDetailList.splice(this.index, 1);
    this.dataSource.data = this.saleDetailList;
  }

  resetSaleDetail(){
    this.saleDetail = new SaleDetail();
    this.saleDetailSelectedIndex = -1;
  }

  saleDetailSelectionToggle(event, saleDetail, index){
    saleDetail.status = event.checked;
    this.saleDetailList[index] = saleDetail;
  }

  save() {
    var data = { 
      priceType: this.priceType,
      itemId: this.itemId,
      store: this.store.id,
      data: {
        sku: this.sku,
        product: this.productId,
        location: this.store.location,
        qty: this.inStockQty,
        maxAlldQty: this.maxAlwdQty,
        unitPrice: this.sellPrice,
        discounts: this.saleDetailList
      }
    };
  	
  	
  	this.priceService.addPrice(data)
  	.subscribe((result)=>{
      console.log(result);
  	});
  }

  salePriceCalculator(value, field){
  	var qty = this.saleDetail.minQty;
  	if(field==="SALE_PRICE"){
  		this.saleDetail.discount = +(this.sellPrice*qty-value).toFixed(0);
  		this.saleDetail.discountPercentage = 
  			+((this.saleDetail.discount/(this.sellPrice*qty))*100).toFixed(1);
  	}else if(field==="DISCOUNT"){
  		this.saleDetail.salePrice = +(this.sellPrice*qty-value).toFixed(0);
  		this.saleDetail.discountPercentage = 
  			+((value/(this.sellPrice*qty))*100).toFixed(1);
  	}else if(field==="DISCOUNT_PERCENT"){
  		this.saleDetail.discount = +((value*this.sellPrice*qty)/100).toFixed(1);
  		this.saleDetail.salePrice = +(this.sellPrice*qty-this.saleDetail.discount).toFixed(1);
  	}else if(field==="QUANTITY"){
  		this.saleDetail.discount = +(this.saleDetail.discountPercentage * value * this.sellPrice/100).toFixed(0);
  		this.saleDetail.salePrice = +(this.sellPrice * value - this.saleDetail.discount).toFixed(0);
  	}
  }

  storeSelectionModified(event){
    this.store = event;
  }
}
