import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Order } from './order';


@Injectable({
  providedIn: 'root'
})
export class OrderService {
  orderUrl: string;
  pincodeTranslationUrl: string;

  constructor(
  	private http: HttpClient,
  ) {
     this.orderUrl = environment.baseurl+'/order';
  }

  get(): Observable<Array<Order>> {
  	return this.http.get<Order>(`${this.orderUrl}`)
  		.pipe(
  			catchError(this.handleError('Get order list', null)));
  }

  list(statuses, pageSize=50, offset=0): Observable<Array<Order>> {
  	return this.http.get<Order>(`${this.orderUrl}/list?statuses=${statuses}&pageSize=${pageSize}&offset=${offset}`)
  		.pipe(
  			catchError(this.handleError('Get order list', null)));
  }

  getOrderDetail(id): Observable<Order> {
  	return this.http.get<Order>(`${this.orderUrl}/detail?orderId=${id}`)
  		.pipe(
  			catchError(this.handleError('Get order detail', null)));
  }

  add(order): Observable<Order> {
    return this.http.post<Order>(this.orderUrl, order)
    .pipe(
       catchError(this.handleError('Add Order', null)));
  }

  addOrderFromSalePoint(order): Observable<any> {
    return this.http.post<any>(`${this.orderUrl}/createOrderOnSalePoint`, order)
    .pipe(
       catchError(this.handleError('Add Order On Sale Point', null)));
  }

  update(order): Observable<Order> {
    return this.http.put<Order>(this.orderUrl, order)
      .pipe(
        catchError(this.handleError('Update Order', null))
      )
  }

  updateStatus(order): Observable<Order> {
    return this.http.put<Order>(`${this.orderUrl}/updateStatus`, order)
      .pipe(
        catchError(this.handleError('Update Order', null))
      )
  }

  delete(orderId): Observable<Order> {
     return this.http.delete<Order>(this.orderUrl +'/'+ orderId)
    .pipe(
       catchError(this.handleError('Delete Order', null)));
  }

  getTotalCost(items: Array<any>){
    if(items==undefined || items===null || items.length===0){
      return 0;
    }
    return items.reduce((total, item)=>{
      if(item.discount?.length>0){
        total = total + item.discount[0].salePrice*item.qty;
      }else{
        total = total + item.sellPrice*item.qty;
      }
      return total;
    }, 0);
  }

  getTotalSavings(items: Array<any>){
    if(items==undefined || items===null||items.length===0){
      return 0;
    }
    return items.reduce((total, item)=>{
      if(item.discount?.length>0){
        total = total + item.discount[0].discount*item.qty;
      }
      return total;
    }, 0);
  }

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
