import { Component, OnInit, Input } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { ProductService } from 'src/app/shoppin/product.service';
import { Store } from '../../store/store';
import { Price } from '../price';
import { PriceService } from '../price.service';
import { SaleDetail } from '../sale-detail';

@Component({
  selector: 'app-price-qty-editor',
  templateUrl: './price-qty-editor.component.html',
  styleUrls: ['./price-qty-editor.component.scss']
})
export class PriceQtyEditorComponent implements OnInit {

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
    private productService: ProductService,
    private priceService: PriceService,
    private notifier: NotifierService
  ) { }

  ngOnInit() {
  }

  addSaleDetail(){
    if(this.saleDetailList ===null || this.saleDetailList === null){
      this.saleDetailList = [];
    }
    this.saleDetailList.push(this.saleDetail);
    this.saleDetail = {minQty:1, saleStartDate: (new Date()).toString(), title:"", salePrice:0.0, discount:0.0,
    discountPercentage:0.0, status: true,
    saleEndDate: (new Date(new Date().setFullYear(new Date().getFullYear() + 1))).toString()};
  }

  deleteSaleDetail(saleDetail, index){
  	this.saleDetailList.splice(this.index, 1);
  }

  save(){
    var data = { 
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
  		data.stockData.id = `VRT_${this.variantId}_${this.store.id}`;
      data.stockData["variantId"] = this.variantId;
  	}else{
  		data.stockData.id = `PRD_${this.productId}_${this.store.id}`;
  	} 
  	
  	
  	this.priceService.addPrice(data)
  	.subscribe((price)=>{
  		this.price = price;
      // this.populatePrice();
  	});

    /* var data = { 
      id: this.productId,
      costPrice: this.costPrice,
      sellPrice: this.sellPrice,
      currency: this.currency,
      discount: this.saleDetailList,
      qty: this.stock,
      maxAlwdQty: this.maxAlwdQty
    }; */

    /* this.productService.updateProduct(data).subscribe((result)=>{
      console.log(result);
      if(result["status"]){
        this.notifier.notify("success", "Product prices updated successfully");
      }
    }); */
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
