import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { Price } from 'src/app/admin/product/price';
import { Product } from 'src/app/admin/product/product';
import { CartService } from '../cart.service';

@Component({
  selector: 'app-add-to-cart-button',
  templateUrl: './add-to-cart-button.component.html',
  styleUrls: ['./add-to-cart-button.component.scss']
})
export class AddToCartButtonComponent implements OnInit {

  @Input("product") product: Product;

  @Input("selectedPrice") selectedPrice: Price;
  qtyControl = new FormControl('');
  qty: number;

  constructor(
    private cartService: CartService,
    private notifierService: NotifierService
  ) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['product']){  
      this.cartService.changes.subscribe(result=>{
        if(result['key']==="cart"){
          this.qty = this.cartService.getItemQty(this.product.id);
        }
      });
      this.qty = this.cartService.getItemQty(this.product.id);
    }    
  }

  updateQuantity(qty) {
    if (this.cartService.validateNewQuantity(this.product, qty, this.selectedPrice)) {
      this.qty = qty;
      this.cartService.updateCart(this.product, this.qty, this.selectedPrice).subscribe(result => {
        if (result) {
          this.notifierService.notify("success", "Cart updated successfully");
        } else {
          this.notifierService.notify("success", "Cart updated successfully");
        }
      });
    }
  }

}
