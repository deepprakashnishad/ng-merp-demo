import { Component, OnInit, Input, Output, SimpleChange, AfterViewInit } from '@angular/core';
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

  @Input()
  isViewMode: boolean=false;

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
  isPriceSame: boolean = false;

  dataSource: MatTableDataSource<SaleDetail> = new MatTableDataSource();

  displayedColumns: string[] = ['salePrice', 'discount', 'discountPercent', 'minQty', 'status', 'actions'];

  initialFetchFlag: boolean = false;

  originalProductPrice: Price;

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
      if((this.priceType==="PRD" ||this.priceType==="VRT") && this.itemId && this.store && this.priceType && this.productId){
        if(!this.initialFetchFlag){
          this.initialFetchFlag = true;
          this.fetchPrice();
        }
      }
	  }
  }

  fetchPrice(){
    this.priceService.getPriceById(this.priceType, this.itemId, this.store.id, this.isViewMode?this.productId:this.isPriceSame?this.productId:null)
    .subscribe(result=>{
      if(result['success']){
        if(this.priceType==="VRT"){
          this.price = result['vrt'];
          this.originalProductPrice = result['prd'];
        }else{
          this.price = result['prd'];
        }
        this.populatePrice();
      }
    });
  }

  isPriceSameUpdated(event){
    if(event && (this.originalProductPrice===undefined||this.originalProductPrice===null)){
      this.priceService.getPriceById("PRD", this.productId, this.store.id)
      .subscribe(result=>{
        if(result.length>0){
          this.originalProductPrice = result['prd'];
          this.populatePrice();
        }
      });
    }else if(this.isPriceSame){
      this.price.unitPrice = undefined;
    }
    console.log(this.isPriceSame);
    this.populatePrice();    
  }

  storeSelectionModified(event){
    this.store = event;
    if(this.price===undefined && (this.priceType==="PRD" ||this.priceType==="VRT") && this.itemId && this.store && this.priceType && this.productId){
      if(!this.initialFetchFlag){
        this.initialFetchFlag = true;
        this.fetchPrice();
      }
    }
  }

  populatePrice(){
    this.inStockQty = this.price.qty;
    this.maxAlwdQty = this.price.maxAlldQty;
    this.sku = this.price.sku;

    if(this.priceType==="PRD" || this.price.unitPrice){
      this.sellPrice = this.price.unitPrice;
      this.saleDetailList = this.price.discounts;
      this.dataSource.data = this.saleDetailList;
    }else if(this.priceType==="VRT" && this.price.unitPrice===undefined){
      this.sellPrice = this.originalProductPrice.unitPrice;
      this.saleDetailList = this.originalProductPrice.discounts;
      this.dataSource.data = this.saleDetailList;
      console.log(this.saleDetailList);
    }
  }

  acceptSaleDetailChanges(){
    if(this.saleDetail.discount===0 || this.saleDetail.discountPercentage===0){
      return;
    }
    if(this.saleDetailList ===null || this.saleDetailList === undefined){
      this.saleDetailList = [];
    }
    if(this.saleDetailSelectedIndex === -1 && this.getSaleDetailMatchingIndex(this.saleDetail.minQty) === -1){
      this.saleDetailList.push(this.saleDetail);
    }
    this.saleDetailList[this.saleDetailSelectedIndex] = this.saleDetail;
    this.dataSource.data = this.saleDetailList;
    this.resetSaleDetail();
  }

  getSaleDetailMatchingIndex(qty: number){
    for(var i=0;i<this.saleDetailList.length;i++){
      if(this.saleDetailList[i].minQty === qty){
        this.saleDetailSelectedIndex = i;
        return i;
      }
    }
    this.saleDetailSelectedIndex = -1;
    return -1;
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
    var priceData = { 
      priceType: this.priceType,
      itemId: this.itemId,
      store: this.store.id,
      data: {
        sku: this.sku,
        product: this.productId,
        location: this.store.location,
        qty: this.inStockQty,
        maxAlldQty: this.maxAlwdQty,
      }
    };
  	
    if(this.priceType==="PRD" || !this.isPriceSame){
      priceData['data']['unitPrice'] = this.sellPrice;
      priceData['data']['discounts'] = this.saleDetailList;
    }
  	
  	this.priceService.addPrice(priceData)
  	.subscribe((result)=>{
      console.log(result);
  	});
  }

  salePriceCalculator(value, field){
  	var qty = this.saleDetail.minQty;
  	if(field==="SALE_PRICE"){
  		this.saleDetail.discount = +(this.sellPrice-value).toFixed(0);
  		this.saleDetail.discountPercentage = 
  			+((this.saleDetail.discount/(this.sellPrice))*100).toFixed(1);
  	}else if(field==="DISCOUNT"){
  		this.saleDetail.salePrice = +(this.sellPrice-value).toFixed(0);
  		this.saleDetail.discountPercentage = 
  			+((value/(this.sellPrice))*100).toFixed(1);
  	}else if(field==="DISCOUNT_PERCENT"){
  		this.saleDetail.discount = +((value*this.sellPrice)/100).toFixed(1);
  		this.saleDetail.salePrice = +(this.sellPrice-this.saleDetail.discount).toFixed(1);
  	}/* else if(field==="QUANTITY"){
  		this.saleDetail.discount = +(this.saleDetail.discountPercentage * value * this.sellPrice/100).toFixed(0);
  		this.saleDetail.salePrice = +(this.sellPrice * value - this.saleDetail.discount).toFixed(0);
  	} */
  }
}
