import { Component, OnInit, Input, Output, SimpleChange } from '@angular/core';
import { PriceService } from './../price.service';
import { SaleDetail } from './../sale-detail';
import { Store } from './../../store/store'
import { Price } from './../price';
import { ProductService } from '../product.service';
import { NotifierService } from 'angular-notifier';

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
	variantId: string;

	index: number;

	store: Store;
	costPrice: number=0.0;
	sellPrice: number;
	stock: number;
  maxAlwdQty: number = 99;
	currency: string="INR";
	saleDetail: SaleDetail;
	saleDetailList: SaleDetail[];
	price:Price;
	minDate = new Date();

  constructor(
    private priceService: PriceService,
    private productService: ProductService,
    private notifier: NotifierService
  ) { }

  ngOnInit() {
  	this.saleDetail = {qty:1, saleStartDate: (new Date()).toString(), title:"", salePrice:0.0, discount:0.0,
  	discountPercentage:0.0,
  		saleEndDate: (new Date(new Date().setFullYear(new Date().getFullYear() + 1))).toString()};
  	this.saleDetailList=[];
  }

  ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
  	for (let propName in changes) {
	    let changedProp = changes[propName];
	    if (propName === "productId") {
        this.productId = changedProp.currentValue;
	    }else if (propName === "variantId") {
        this.variantId = changedProp.currentValue;
      }else if(propName === "priceType"){
        this.priceType = changedProp.currentValue;
      }
      if((this.priceType==="product" && this.productId && this.store) ||
        (this.priceType==="variant" && this.productId && this.store && this.variantId)){
        this.fetchPrice();
      }
      if(this.priceType==="product" && this.productId){
        this.fetchPrice();
      }
	  }
  }

  fetchPrice(){
    this.productService.getProductById(this.productId).subscribe(result=>{
      this.costPrice = result['costPrice'];
      this.sellPrice = result['sellPrice'];
      this.stock = result['qty'];
      this.maxAlwdQty = result['maxAlwdQty'];
      this.saleDetailList = result['discount'];
      this.saleDetail = this.saleDetailList[0];
    });
    /* if(this.priceType==="product" && this.productId){
      this.priceService.getPrices(this.priceType, this.productId)
      .subscribe(price=>{
        this.price = price;
        this.populatePrice();
      });
    }else if(this.priceType==="variant" && this.productId && this.variantId){
      this.priceService.getPrices(this.priceType, this.productId, this.variantId)
      .subscribe(price=>{
        console.log();
        this.price = price;
        this.populatePrice();
      });
    } */
  }

  storeSelected(event){
  	this.store = event;
    this.fetchPrice();
  }

  populatePrice(){
    var id;
    if(this.priceType === "variant" && this.variantId){
      id = `VART${this.variantId}_${this.store.id}`;
      for(var i=0; i< this.price.variantStockDetails!.length;i++){
        if(id === this.price.variantStockDetails[i].id){
          this.costPrice = this.price.variantStockDetails[i].priceDetail.costPrice;
          this.sellPrice = this.price.variantStockDetails[i].priceDetail.price;
          this.currency = this.price.variantStockDetails[i].priceDetail.currency;
          this.stock = this.price.variantStockDetails[i].stock;
          this.saleDetailList = this.price.variantStockDetails[i].priceDetail.saleList;
        }
      }
    }else{
      id = `PROD${this.productId}_${this.store.id}`;
      for(var i=0; i< this.price.altStockDetails!.length;i++){
        if(id === this.price.altStockDetails[i].id){
          this.costPrice = this.price.altStockDetails[i].priceDetail.costPrice;
          this.sellPrice = this.price.altStockDetails[i].priceDetail.price;
          this.currency = this.price.altStockDetails[i].priceDetail.currency;
          this.stock = this.price.altStockDetails[i].stock;
          this.saleDetailList = this.price.altStockDetails[i].priceDetail.saleList;
        }
      }
    }
  }

  addSaleDetail(){
    if(this.saleDetailList ===null || this.saleDetailList === null){
      this.saleDetailList = [];
    }
    //this.saleDetailList.push(this.saleDetail);
    this.saleDetailList[0] = this.saleDetail;
    //this.saleDetail = {qty:1, saleStartDate: (new Date()).toString(), title:"", salePrice:0.0, discount:0.0,
    //discountPercentage:0.0,
    //saleEndDate: (new Date(new Date().setFullYear(new Date().getFullYear() + 1))).toString()};
  }

  deleteSaleDetail(saleDetail, index){
  	this.saleDetailList.splice(this.index, 1);
  }

  save() {
    this.addSaleDetail();
    /*var data = { 
      productId: this.productId,
      storeId: this.store.id,
      stockData:{
        id: "",
        storeId: this.store.id,
        location: this.store.location,
        stock: this.stock,
        priceDetail:{
          costPrice: this.costPrice,
          price: this.sellPrice,
          currency: this.currency,
          saleList: this.saleDetailList,
        }
      }
    };

  	if(this.variantId){
  		data.stockData.id = `VART${this.variantId}_${this.store.id}`;
      data.stockData["variantId"] = this.variantId;
  	}else{
  		data.stockData.id = `PROD${this.productId}_${this.store.id}`;
  	} 
  	
  	
  	this.priceService.addPrice(data)
  	.subscribe((price)=>{
  		this.price = price;
      this.populatePrice();
  	});*/

    var data = { 
      id: this.productId,
      costPrice: this.costPrice,
      sellPrice: this.sellPrice,
      currency: this.currency,
      discount: this.saleDetailList,
      qty: this.stock,
      maxAlwdQty: this.maxAlwdQty
    };

    this.productService.updateProduct(data).subscribe((result)=>{
      console.log(result);
      if(result["status"]){
        this.notifier.notify("success", "Product prices updated successfully");
      }
    });
  }

  salePriceCalculator(value, field){
  	var qty = this.saleDetail.qty;
  	if(field==="SALE_PRICE"){
  		this.saleDetail.discount = +(this.sellPrice*qty-value).toFixed(0);
  		this.saleDetail.discountPercentage = 
  			+((this.saleDetail.discount/(this.sellPrice*qty))*100).toFixed(1);
  	}else if(field==="DISCOUNT"){
  		this.saleDetail.salePrice = +(this.sellPrice*qty-value).toFixed(0);
  		this.saleDetail.discountPercentage = 
  			+((value/this.sellPrice*qty)*100).toFixed(1);
  	}else if(field==="DISCOUNT_PERCENT"){
  		this.saleDetail.discount = +((value*this.sellPrice*qty)/100).toFixed(1);
  		this.saleDetail.salePrice = +(this.sellPrice*qty-this.saleDetail.discount).toFixed(1);
  	}else if(field==="QUANTITY"){
  		this.saleDetail.discount = +(this.saleDetail.discountPercentage * value * this.sellPrice/100).toFixed(0);
  		this.saleDetail.salePrice = +(this.sellPrice * value - this.saleDetail.discount).toFixed(0);
  	}
  }
}
