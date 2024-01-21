import { Injectable, Inject } from '@angular/core';
import { environment } from './../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Price } from './price';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PriceService {

	priceUrl: string;

  constructor(
  	private http: HttpClient,
  ) {
     this.priceUrl = environment.baseurl + '/inventory';
  }

  bulkUploadProducts(products: Array<any>, storeid: string): Observable<any>{
    return this.http.post<Array<any>>(`${this.priceUrl}/bulkUpload`, {"products": products, "storeId": storeid})
      .pipe(
        catchError(this.handleError('Get Token', null)));
  }

  getPrices(
    type: string,
    productId: string, 
    variantId?: string, 
    storeId?: string
  ): Observable<Price> {
    var url = `${this.priceUrl}?type=${type}&product=${productId}`;
    if(type==="variant" && variantId){
      url = `${url}&variant=${variantId}`;
    }
    if(storeId){
      url = `${url}&store=${storeId}`;
    }
  	return this.http.get<Array<Price>>(url)
  		.pipe(
  			catchError(this.handleError('Get Token', null)));
  }

  getPriceById(priceType: string, itemId: string, storeId: string, productId?: string): Observable<Array<any>>{
    var url = `${this.priceUrl}?priceType=${priceType}&id=${priceType}_${itemId}_${storeId}`;
    if(productId && priceType==='VRT'){
      url = `${url}&prdId=PRD_${productId}_${storeId}`;
    }
    return this.http.get<Array<any>>(url)
      .pipe(
        catchError(this.handleError('Get Token', null))); 
  }

  getPriceByProductIdAndStoreId(productId, storeId): Observable<Price>{
    return this.http.get<Price>(`${this.priceUrl}?product=${productId}&store=${storeId}`)
      .pipe(
        catchError(this.handleError('Get Token', null))); 
  }

  addPrice(data): Observable<Price> {
    return this.http.post<Price>(this.priceUrl, data)
    .pipe(
       catchError(this.handleError('Add Price', null)));
  }

  updatePrice(price): Observable<Price> {
    return this.http.put<Price>(this.priceUrl, price)
      .pipe(
        catchError(this.handleError('Update Price', null))
      )
  }

  /*deletePrice(priceId): Observable<Price> {
     return this.http.delete<Price>(this.priceUrl +'/'+ priceId)
    .pipe(
       catchError(this.handleError('Delete price', null)));
  }*/

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
