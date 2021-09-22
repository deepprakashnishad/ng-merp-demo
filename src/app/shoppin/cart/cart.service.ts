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

  getTotalAmount(): number{
    var cartItems: Array<CartItem> = CartItem.fromJSON(JSON.parse(localStorage.getItem("cart")));
    return cartItems.reduce((total, item)=>{
      if(item['product'].discount?.length>0){
        total = total + item['product'].discount[0].salePrice*item.qty;
      }else{
        total = total + item['product'].sellPrice*item.qty;
      }
      return total;
    }, 0);
  }

  getTotalSavings(): number{
    var cartItems: Array<CartItem> = CartItem.fromJSON(JSON.parse(localStorage.getItem("cart")));
    return cartItems.reduce((total, item)=>{
      if(item['product'].discount?.length>0){
        total = total + item['product'].discount[0].discount*item.qty;
      }
      return total;
    }, 0);
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

  updateCart(product: Product, qty){
    var cart = JSON.parse(localStorage.getItem("cart"));
    var FOUND_FLAG = false
    if(cart == null){
      cart = [{product: product, qty: qty}];
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
        cart.push({product: product, qty: qty});
      }
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    this.onSubject.next({ key: "cart", value: cart});
    if(this.authService.isLoggedIn.getValue()){
      return this.http.put<any>(
        this.url, {product: product, qty: qty})
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

  updateLocalCart(product: Product, qty){
    var cart = JSON.parse(localStorage.getItem("cart"));
    var FOUND_FLAG = false
    if(cart == null){
      cart = [{product: product, qty: qty}];
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
        cart.push({product: product, qty: qty});
      }
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    this.onSubject.next({ key: "cart", value: cart});
  }

  syncCart(){
    var cartItems: Array<CartItem> = JSON.parse(localStorage.getItem("cart"));
    if(cartItems!==null && cartItems.length>0){
      var cart = cartItems.map(item=>{
        return {id: item.id, product: item.product.id, qty: item.qty};
      });
      return this.http.put<any>(
        this.url+"/syncCart", cart)
        .pipe(
          catchError(this.handleError('Sync cart', null))
        );
    }
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

  validateNewQuantity(product, qty) {
    if (qty > product.maxAlwdQty) {
      this.notifier.notify("error", `Maximum allowed quantity is ${product.maxAlwdQty}`);
      return false;
    }

    if (qty > product.qty) {
      var msg = `Only ${product.qty} ${product.qty === 1 ? 'is' : 'are'} available`;
      if (product.qty === 0) {
        msg = "Out of stock";
      }
      this.notifier.notify("error", `Only ${product.qty} ${product.qty === 1 ? 'is' : 'are'} available`);
      return false;
    }
    return true;
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
