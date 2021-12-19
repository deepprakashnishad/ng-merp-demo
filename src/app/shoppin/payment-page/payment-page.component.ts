import { Component, OnInit } from '@angular/core';
import { Address } from 'cluster';
import { CartItem } from '../cart/cart';
import { CartService } from '../cart/cart.service';

@Component({
  selector: 'app-payment-page',
  templateUrl: './payment-page.component.html',
  styleUrls: ['./payment-page.component.scss']
})
export class PaymentPageComponent implements OnInit {

  fulfillmentMethod: string;
  fulfillmentAddress: Address;

  constructor(private cartService: CartService) { }

  ngOnInit() {
    this.fulfillmentAddress = JSON.parse([sessionStorage.getItem("selectedAddress")][0]);
    this.fulfillmentMethod = sessionStorage.getItem("fulfillmentType");

    this.cartService.syncCart()?.subscribe(result=>{
      result = CartItem.fromJSON(result);
      this.cartService.replaceCart(result);
    });
  }

}
