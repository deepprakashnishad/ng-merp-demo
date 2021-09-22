import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
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


  constructor(
    private cartService: CartService,
    private notifierService: NotifierService,
    private router: Router
  ) { }

  ngOnInit() {
    this.cartService.changes.subscribe(result=>{
      if(result['key']==="cart"){
        this.qty = this.cartService.getItemQty(this.product.id);
      }
    });
    this.qty = this.cartService.getItemQty(this.product.id);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['product'] && changes['product']['currentValue']){
      this.product = changes['product']['currentValue'];
    }    
  }

  updateQuantity(qty){
    this.qty = qty;
    this.cartService.updateCart(this.product, this.qty).subscribe(result=>{
      if(result){
        this.notifierService.notify("success", "Cart updated successfully");
      }else{
        this.notifierService.notify("success", "Cart updated successfully");
      }
    });
  }

  showDetail(){
    this.router.navigate([`product/${this.product.id}`]);
  }
}
