import { Component, Input, OnInit, SimpleChange } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { CartItem } from './cart';
import { environment } from '../../../environments/environment';
import { CartService } from './cart.service';
import { Product } from 'src/app/admin/product/product';
import { L } from '@angular/cdk/keycodes';

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
        this.cart = CartItem.fromJSON(result);
      });
    }else{
      this.cart = this.cartService.getCartFromStorage();
    }
  }

  updateQuantity(element: CartItem, qty) {
    if (this.cartService.validateNewQuantity(element.product, qty, element.selectedPrice)) {
      this.cartService.updateCart(element.product, qty, element.selectedPrice).subscribe(result => { 
        if (result) {
          this.notifier.notify("success", "Cart updated successfully");
        } else {
          this.notifier.notify("success", "Cart updated successfully");
        }
      });
    }    
  }

  getDiscountedPrice(cartItem: CartItem){
    var discounts = cartItem.selectedPrice.discounts;
    var selectedDiscount;
    var qty = cartItem.qty;
    for(var i=0; i < discounts.length;i++){
      if(discounts[i]?.minQty === 1 && selectedDiscount === undefined && (qty===0||qty===undefined)){
        selectedDiscount = discounts[i];
      }else if(discounts[i]?.minQty <= qty && (selectedDiscount?.minQty < discounts[i]?.minQty || selectedDiscount===undefined)){
        selectedDiscount = discounts[i];
      }else if(discounts[i]?.minQty <= qty && qty<selectedDiscount?.minQty && selectedDiscount?.minQty > discounts[i].minQty){
        selectedDiscount = discounts[i];
      }
    }

    return selectedDiscount.salePrice;
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

  getAttributeString(attrs){
    var attrStr="";
    if(attrs == undefined || attrs==null){
      return;
    }
    var keys = Object.keys(attrs);
    for(var key of keys){
      attrStr = `${key}: ${attrs[key]}`;
    }
    return attrStr;
  }
}
