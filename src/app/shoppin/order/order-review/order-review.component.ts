import { Component, OnInit } from '@angular/core';
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
      this.cartService.replaceCart(result);
      /* result.forEach(element => {
        this.cartService.updateLocalCart(element['product'], element['qty']);
      }); */
    });
  }

}
