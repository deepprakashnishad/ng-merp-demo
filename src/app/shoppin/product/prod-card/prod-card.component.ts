import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { Price } from 'src/app/admin/product/price';
import { Product } from 'src/app/admin/product/product';
import { CartService } from 'src/app/shoppin/cart/cart.service';

@Component({
  selector: 'app-prod-card',
  templateUrl: './prod-card.component.html',
  styleUrls: ['./prod-card.component.scss']
})
export class ProdCardComponent implements OnInit {

  @Input("product") product: Product;
  qty: number;
  qtyControl = new FormControl('');
  weightAttr: string;
  selectedPrice: Price = new Price(); 
  unitDiscount: any;

  selectedDiscount: any;
  selectedIndex: number=-1;

  constructor(
    private cartService: CartService,
    private notifierService: NotifierService,
    private router: Router
  ) { }

  ngOnInit() {
    this.cartService.changes.subscribe(result=>{
      if(result['key']==="cart"){
        this.qty = this.cartService.getItemQty(this.product.id);
        this.updateDiscountIndex();
      }
    });
    this.qty = this.cartService.getItemQty(this.product.id);
    this.updateDiscountIndex();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['product'] && changes['product']['currentValue']){
      this.product = changes['product']['currentValue'];
      this.selectedPrice = this.product.prices[0];
      this.updateDiscountIndex();
    }    
  }

  updateQuantity(qty){
    this.qty = qty;
    this.cartService.updateCart(this.product, this.qty, this.selectedPrice).subscribe(result=>{
      if(result){
        this.notifierService.notify("success", "Cart updated successfully");
      }else{
        this.notifierService.notify("success", "Cart updated successfully");
      }
    });
  }

  selectedDiscountUpdated(event){
    this.cartService.updateCart(this.product, event.minQty, this.selectedPrice).subscribe(result=>{
      if(result){
        this.notifierService.notify("success", "Cart updated successfully");
      }else{
        this.notifierService.notify("success", "Cart updated successfully");
      }
    });
  }

  updateDiscountIndex(){
    var discounts = this.selectedPrice.discounts;
    for(var i=0; i < discounts?.length;i++){
      if(discounts[i]?.minQty === 1 && this.selectedDiscount === undefined && (this.qty===0||this.qty===undefined)){
        this.selectedDiscount = discounts[i];
        this.unitDiscount = this.selectedDiscount;
        this.selectedIndex=-1;
      }else if(discounts[i]?.minQty <= this.qty && (this.selectedDiscount?.minQty < discounts[i]?.minQty || this.selectedDiscount===undefined)){
        this.selectedDiscount = discounts[i];
      }else if(discounts[i]?.minQty <= this.qty && this.qty<this.selectedDiscount?.minQty && this.selectedDiscount?.minQty > discounts[i].minQty){
        this.selectedDiscount = discounts[i];
      }/* else{
        this.selectedDiscount = this.unitDiscount;
      } */
    }
  }

  showDetail(){
    this.router.navigate([`product/${this.product.id}`]);
  }
}
