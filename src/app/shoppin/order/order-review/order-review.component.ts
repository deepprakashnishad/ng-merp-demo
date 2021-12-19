import { Component, OnInit } from '@angular/core';
import { CartItem } from '../../cart/cart';
import { CartService } from '../../cart/cart.service';

@Component({
  selector: 'app-order-review',
  templateUrl: './order-review.component.html',
  styleUrls: ['./order-review.component.scss']
})
export class OrderReviewComponent implements OnInit {

  constructor(
    private cartService: CartService
  ) { }

  ngOnInit() {
    this.cartService.syncCart().subscribe(result=>{
      result = CartItem.fromJSON(result);
      this.cartService.replaceCart(result);
    });
  }

}
