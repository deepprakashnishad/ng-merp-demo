import { Injectable, Inject, OnDestroy } from '@angular/core';
import { environment } from '../../../environments/environment';
import {HttpClient, HttpHeaders, HttpErrorResponse} from '@angular/common/http';
import {Observable, of, throwError} from 'rxjs';
import { Subject } from 'rxjs';
import { retry, catchError, map, tap, share } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthInterceptorSkipHeader } from '../../http-interceptors/auth-interceptor';
import { AuthenticationService } from '../../authentication/authentication.service';
import { Product } from 'src/app/admin/product/product';
import { CartItem } from 'src/app/shoppin/cart/cart';
import { J } from '@angular/cdk/keycodes';
import { NotifierService } from 'angular-notifier';
import { Price } from 'src/app/admin/product/price';

@Injectable({
  providedIn: 'root'
})
export class CartService implements OnDestroy {

  url: string;
  private onSubject = new Subject<{ key: string, value: any }>();
  public changes = this.onSubject.asObservable().pipe(share());

  constructor(
    private http: HttpClient,
    private notifier: NotifierService,
    private authService: AuthenticationService
  ) { 
    this.url = environment.baseurl + "/Cart";
    this.start();
  }

  ngOnDestroy(){
    this.stop();
  }

  private start(): void {
    window.addEventListener("storage", this.storageEventListener.bind(this));
  }

  private storageEventListener(event: StorageEvent) {
    if (event.storageArea == localStorage) {
      let v;
      try { v = JSON.parse(event.newValue); }
      catch (e) { v = event.newValue; }
      this.onSubject.next({ key: event.key, value: v });
    }
  }

  private stop(): void {
    window.removeEventListener("storage", this.storageEventListener.bind(this));
    this.onSubject.complete();
  }

  getTotalCostOfItems(items: Array<any>){
    if(items==undefined || items===null || items.length===0){
      return 0;
    }
    return items.reduce((total, item)=>{
      if(item.prices[0]?.discounts?.length>0){
        total = total + this.getDiscountedPrice(item.qty, item.prices[0].discounts).salePrice*item.qty;
      }else{
        total = total + item.prices[0]?.unitPrice*item.qty;
      }
      return total;
    }, 0);
  }

  getTotalSavingsOfItems(items: Array<any>){
    if(items==undefined || items===null||items.length===0){
      return 0;
    }
    return items.reduce((total, item)=>{
      if(item.prices[0].discounts?.length>0){
        total = total + this.getDiscountedPrice(item.qty, item.prices[0].discounts).discount*item.qty;
      }
      return total;
    }, 0);
  }

  getTotalAmount(cartItems?: Array<CartItem>): number{
    if(cartItems==undefined || cartItems===null || cartItems.length===0){
      cartItems = CartItem.fromJSON(JSON.parse(localStorage.getItem("cart")));
    }
    // var cartItems: Array<CartItem> = CartItem.fromJSON(JSON.parse(localStorage.getItem("cart")));
    return cartItems.reduce((total, item)=>{
      if(item.selectedPrice?.discounts?.length>0){
        total = total + this.getDiscountedPrice(item.qty, item.selectedPrice.discounts).salePrice*item.qty;
      }else{
        total = total + item.selectedPrice?.unitPrice*item.qty;
      }
      return total;
    }, 0);
  }

  getTotalSavings(cartItems?: Array<CartItem>): number{
    if(cartItems==undefined || cartItems){
      cartItems = CartItem.fromJSON(JSON.parse(localStorage.getItem("cart")));
    }
    // var cartItems: Array<CartItem> = CartItem.fromJSON(JSON.parse(localStorage.getItem("cart")));
    return cartItems.reduce((total, item)=>{
      if(item.selectedPrice.discounts?.length>0){
        total = total + this.getDiscountedPrice(item.qty, item.selectedPrice.discounts).discount*item.qty;
      }
      return total;
    }, 0);
  }

  getDiscountedPrice(qty, discounts){
    if(!discounts){
      return "";
    }
    var selectedDiscount;
    for(var i=0; i < discounts.length;i++){
      if(discounts[i]?.minQty === 1 && selectedDiscount === undefined && (qty===0||qty===undefined)){
        selectedDiscount = discounts[i];
      }else if(discounts[i]?.minQty <= qty && (selectedDiscount?.minQty < discounts[i]?.minQty || selectedDiscount===undefined)){
        selectedDiscount = discounts[i];
      }else if(discounts[i]?.minQty <= qty && qty<selectedDiscount?.minQty && selectedDiscount?.minQty > discounts[i].minQty){
        selectedDiscount = discounts[i];
      }
    }

    return selectedDiscount;
  }

  getItemQty(productId){
    var cart = JSON.parse(localStorage.getItem("cart"));
    if(cart==null){
      return 0;  
    }
    for(var item of cart){
      if(item['product']['id'] === productId){
        return item['qty'];
      }
    }
    return 0;
  }

  updateCart(product: any, qty: number, selectedPrice: Price){
    var cart = JSON.parse(localStorage.getItem("cart"));
    var FOUND_FLAG = false
    if(cart == null){
      cart = [{product: product, qty: qty, "selectedPrice": selectedPrice}];
    }else{
      for(let i=0;i<cart.length;i++){
        if(cart[i]['product']['id'] === product.id && qty!==0){
          cart[i]['qty'] = qty;
          FOUND_FLAG = true;
          break;
        }else if(cart[i]['product']['id'] === product.id && qty===0){
          cart.splice(i,1);
          FOUND_FLAG = true;
          break;
        }
      }
      if(!FOUND_FLAG && qty>0){
        cart.push({product: product, qty: qty, "selectedPrice": selectedPrice});
      }
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    this.onSubject.next({ key: "cart", value: cart});
    if(this.authService.isLoggedIn.getValue()){
      var postData = {
        qty: qty, 
        "selectedPrice": selectedPrice.id
      };
      if(product.product !== undefined && product.product !== null){
        postData['product'] = product.product;
        postData['variant'] = product.id;
      }else{
        postData['product'] = product.id;
      }
      return this.http.put<any>(
        this.url, postData)
        .pipe(
          catchError(this.handleError('Update cart', null))
        );
    }else{
      return new Observable();
    }
  }

  replaceCart(cartItems){
    localStorage.removeItem("cart");
    localStorage.setItem("cart", JSON.stringify(cartItems));
    this.onSubject.next({key: "cart", value: cartItems});
  }

  deleteLocalCart(){
    //localStorage.removeItem("cart");
    localStorage.setItem("cart", JSON.stringify([]));
    this.onSubject.next({ key: "cart", value: [] });
  }

  updateLocalCart(product: Product, qty: number, selectedPrice: Price){
    var cart = JSON.parse(localStorage.getItem("cart"));
    var FOUND_FLAG = false
    if(cart == null){
      cart = [{product: product, qty: qty, selectedPrice: selectedPrice}];
    }else{
      for(let i=0;i<cart.length;i++){
        if(cart[i]['product']['id'] === product.id && qty!==0){
          cart[i]['qty'] = qty;
          FOUND_FLAG = true;
          break;
        }else if(cart[i]['product']['id'] === product.id && qty===0){
          cart.splice(i,1);
          FOUND_FLAG = true;
          break;
        }
      }
      if(!FOUND_FLAG && qty>0){
        cart.push({product: product, qty: qty, selectedPrice: selectedPrice});
      }
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    this.onSubject.next({ key: "cart", value: cart});
  }

  syncCart(){
    var cartItems: Array<CartItem> = JSON.parse(localStorage.getItem("cart"));
    var cart = cartItems?.map(item=>{
      var cartItemData = {
        id: item.id, 
        qty: item.qty, 
        selectedPrice: item.selectedPrice?.id
      };
      if(item.product.product !== undefined && item.product.product !== null){
        cartItemData['variant'] = item.product.id;
        cartItemData['product'] = item.product.product;
      }else{
        cartItemData['product'] = item.product.id;
      }
      return cartItemData;
    });
    return this.http.put<any>(
      this.url+"/syncCart", cart)
      .pipe(
        catchError(this.handleError('Sync cart', null))
      );
  }

  getCart(){
    return this.http.get<any>(
      this.url)
      .pipe(
        retry(2),
        catchError(this.handleError('Cart retrieval', null))
      );
  }

  getCartFromStorage(){
    return JSON.parse(localStorage.getItem("cart"));
  }

  getLocalCart(): Observable<any>{
    return JSON.parse(localStorage.getItem("cart"));
  }

  validateNewQuantity(product, qty, selectedPrice: Price) {
    if (qty > selectedPrice.maxAlldQty) {
      this.notifier.notify("error", `Maximum allowed quantity is ${selectedPrice.maxAlldQty}`);
      return false;
    }

    if (qty > selectedPrice.qty) {
      var msg = `Only ${selectedPrice.qty} ${selectedPrice.qty === 1 ? 'is' : 'are'} available`;
      if (product.qty === 0) {
        msg = "Out of stock";
      }
      this.notifier.notify("error", `Only ${selectedPrice.qty} ${selectedPrice.qty === 1 ? 'is' : 'are'} available`);
      return false;
    }
    return true;
  }

  priceInWords(price) {
    var sglDigit = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"],
      dblDigit = ["Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"],
      tensPlace = ["", "Ten", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"],
      handle_tens = function(dgt, prevDgt) {
        return 0 == dgt ? "" : " " + (1 == dgt ? dblDigit[prevDgt] : tensPlace[dgt])
      },
      handle_utlc = function(dgt, nxtDgt, denom) {
        return (0 != dgt && 1 != nxtDgt ? " " + sglDigit[dgt] : "") + (0 != nxtDgt || dgt > 0 ? " " + denom : "")
      };
  
    var str = "",
      digitIdx = 0,
      digit = 0,
      nxtDigit = 0,
      words = [];
    if (price += "", isNaN(parseInt(price))) str = "";
    else if (parseInt(price) > 0 && price.length <= 10) {
      for (digitIdx = price.length - 1; digitIdx >= 0; digitIdx--) switch (digit = price[digitIdx] - 0, nxtDigit = digitIdx > 0 ? price[digitIdx - 1] - 0 : 0, price.length - digitIdx - 1) {
        case 0:
          words.push(handle_utlc(digit, nxtDigit, ""));
          break;
        case 1:
          words.push(handle_tens(digit, price[digitIdx + 1]));
          break;
        case 2:
          words.push(0 != digit ? " " + sglDigit[digit] + " Hundred" + (0 != price[digitIdx + 1] && 0 != price[digitIdx + 2] ? " and" : "") : "");
          break;
        case 3:
          words.push(handle_utlc(digit, nxtDigit, "Thousand"));
          break;
        case 4:
          words.push(handle_tens(digit, price[digitIdx + 1]));
          break;
        case 5:
          words.push(handle_utlc(digit, nxtDigit, "Lakh"));
          break;
        case 6:
          words.push(handle_tens(digit, price[digitIdx + 1]));
          break;
        case 7:
          words.push(handle_utlc(digit, nxtDigit, "Crore"));
          break;
        case 8:
          words.push(handle_tens(digit, price[digitIdx + 1]));
          break;
        case 9:
          words.push(0 != digit ? " " + sglDigit[digit] + " Hundred" + (0 != price[digitIdx + 1] || 0 != price[digitIdx + 2] ? " and" : " Crore") : "")
      }
      str = words.reverse().join("")
    } else str = "";
    return str
  
  }

    /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // Let the app keep running by returning an empty result.
      if (error instanceof ErrorEvent) {
        return throwError('Unable to submit request. Please check your internet connection.');
      } else {
        return throwError(error);
      }
    };
  }
}
