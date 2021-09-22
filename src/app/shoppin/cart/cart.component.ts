import { Component, Input, OnInit, SimpleChange } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { CartItem } from './cart';
import { environment } from '../../../environments/environment';
import { CartService } from './cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  @Input("isEditable") isEditable: boolean = true;
  @Input("displayActionButton") displayActionButton: boolean = true;
  @Input("buttonText") buttonText: string = "Checkout";
  @Input("buttonRoute") buttonRoute: Array<string> = ["/order-review"];
  @Input("buttonIcon") buttonIcon: string = "point_of_sale";
  @Input("loadCartFromServer") loadCartFromServer: boolean = false;

  @Input("displayTotalWithDelivery") displayTotalWithDelivery: boolean = false;

  @Input("isCompact") isCompact: boolean = false;
  cart: Array<CartItem>;
  totalAmount: number;
  displayedColumns: string[] = ['position', 'name', 'unitPrice', 'qty', 'subTotal', 'action'];
  tableFooterColumns: string[] = ['title', 'total'];
  
  deliveryCharges = environment.deliveryCharges;
  minOrderFreeDelivery = environment.minOrderFreeDelivery;

  constructor(
    private cartService: CartService,
    private notifier: NotifierService
  ) { }

  ngOnInit() {
    this.cartService.changes.subscribe(result=>{
      if(result['key']==="cart"){
        this.cart = result['value'];
      }
    });
    if(this.loadCartFromServer){
      this.cartService.getCart().subscribe(result=>{
        this.cart = result;
      });
    }else{
      this.cart = this.cartService.getCartFromStorage();
    }
  }

  updateQuantity(element, qty) {
    if (this.cartService.validateNewQuantity(element.product, qty)) {
      this.cartService.updateCart(element.product, qty).subscribe(result => {
        if (result) {
          this.notifier.notify("success", "Cart updated successfully");
        } else {
          this.notifier.notify("success", "Cart updated successfully");
        }
      });
    }    
  }

  getTotalCost(){
    return this.cartService.getTotalAmount();
  }

  getTotalSavings(){
    return this.cartService.getTotalSavings();
  }

  ngOnChanges(changes: { [propName: string]: SimpleChange }) {
    if (changes['isCompact'] && changes['isCompact']['currentValue']) {
      this.displayedColumns = ['name', 'unitPrice', 'qty', 'subTotal'];
    } else {
      this.displayedColumns = ['position', 'name', 'unitPrice', 'qty', 'subTotal', 'action'];
    };
  }
}
