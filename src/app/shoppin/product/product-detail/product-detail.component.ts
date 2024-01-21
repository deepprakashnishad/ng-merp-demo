import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/admin/product/product';
import { ProductService } from './../../product.service';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
import { fade } from 'src/app/animation';

// import Swiper core and required modules
import SwiperCore, { Pagination } from "swiper/core";
import { MediaChange, MediaObserver, ScreenTypes } from '@angular/flex-layout';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/internal/operators/filter';
import { NotifierService } from 'angular-notifier';
import { StorageService } from '../../../storage.service';
import { Price } from 'src/app/admin/product/price';
import { CartService } from '../../cart/cart.service';

// install Swiper modules
SwiperCore.use([Pagination]);


@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fade
})
export class ProductDetailComponent implements OnInit {

  public isHandset$: Observable<boolean>;
  selectedProduct: Product = new Product();
  products: Array<any> = [];
  selectedPrice: Price = new Price(); 
  selectedDiscount: any;
  selectedImage: string;
  enableAnimation = false;
  state = 'in';
  
  isHandset: boolean = false;
  qtyMap: Map<string, number> = new Map();
  storeSettings = JSON.parse(sessionStorage.getItem("storeSettings"));

  attrSelectedValueMap: Map<string, string> = new Map();

  variantAttrMap: Map<string, Array<any>> = new Map();

  constructor(
    private productService: ProductService,
    private activatedRoute: ActivatedRoute,
    private mediaObserver: MediaObserver,
    private notifier: NotifierService,
    private cartService: CartService
  ) { 
    this.mediaObserver
      .asObservable()
      .pipe(
        filter((changes: MediaChange[]) => changes.length > 0),
        map((changes: MediaChange[]) => changes[0])
      ).subscribe((change: MediaChange) => {
        if ( change.mqAlias == 'xs') {
          this.isHandset = true;
        }
      });
  }

  ngOnInit() {
    const productId = this.activatedRoute.snapshot.paramMap.get("id");
    const variantId = this.activatedRoute.snapshot.paramMap.get("variantId");
    console.log(`Variant Id - ${variantId}`);

    this.productService.getProductById(productId).subscribe(result => {
      if (result['success'] === false) {
        this.notifier.notify("error", result["msg"]);
      } else {
        this.products = result;
        var found = false;
        for(var product of this.products){
          if(product.id===variantId){
            this.selectedProduct = product;
            this.selectedPrice = product.prices[0];
            this.selectedImage = product?.assets?.imgs[0]?.downloadUrl;  
            found=true;
          }
        }
        if(!found){
          this.selectedProduct = result[0];
          this.selectedPrice = this.selectedProduct.prices[0];
          this.selectedImage = this.selectedProduct?.assets?.imgs[0]?.downloadUrl;
        }        
        this.initializeVariantAttrMap();
      }

      this.cartService.changes.subscribe(result=>{
        if(result['key']==="cart"){
          this.qtyMap[this.selectedProduct.id] = this.cartService.getItemQty(this.selectedProduct.id);
          this.selectedDiscount = this.cartService.getDiscountedPrice(this.qtyMap[this.selectedProduct.id], this.selectedPrice.discounts);
        }
      });
      this.qtyMap[this.selectedProduct.id] = this.cartService.getItemQty(this.selectedProduct.id);
      this.selectedDiscount = this.cartService.getDiscountedPrice(this.qtyMap[this.selectedProduct.id], this.selectedPrice.discounts);
    });
  }

  initializeVariantAttrMap(){
    if(this.products[0]?.variants !== null && this.products[0]?.variants?.attrs !== null){
      var varAttrs = Object.keys(this.products[0]?.variants?.attrs);

      for(var attr of varAttrs){
        for(var product of this.products){
          if(this.variantAttrMap[attr]===undefined || this.variantAttrMap[attr]===null){
            this.variantAttrMap[attr] = [];
          }
          if(product.attrs[attr]){
            this.variantAttrMap[attr].push(product.attrs[attr]);
          }
        }

        this.attrSelectedValueMap[attr] = this.selectedProduct.attrs[attr];
      }
    }
  }

  attrSelectionUpdated(event){
    console.log(event);
    var varAttrs = Object.keys(this.products[0]?.variants?.attrs);
    var check = false;
    for(var product of this.products){
      for(var varAttr of varAttrs){
        if(this.attrSelectedValueMap[varAttr] === product.attrs[varAttr]){
          check = true;
        }else{
          check = false;
          break;
        }
      }
      if(check){
        this.selectedProduct = product;
        this.selectedPrice = product.prices[0];
        this.selectedDiscount = this.cartService.getDiscountedPrice(this.qtyMap[this.selectedProduct.id], this.selectedPrice.discounts);
        break;
      }
    }

    if(!check){
      this.notifier.notify("error", "No product exists with selected attributes");
    }
  }

  onImageSelected(url){
    this.selectedImage = url;
    this.enableAnimation = true;
    this.toggleState();
  }

  onDone($event) {
    if (this.enableAnimation) {
      this.toggleState();
      this.enableAnimation = false;
    }
  }

  toggleState() {
      this.state = this.state === 'in' ? 'out' : 'in';
  }
}
