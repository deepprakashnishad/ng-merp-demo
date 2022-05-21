import { Injectable, Inject } from '@angular/core';
import { environment } from './../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Product } from './../admin/product/product';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
	productUrl: string;

  constructor(
  	private http: HttpClient,
  ) {
     this.productUrl = environment.baseurl + '/Shoppin';
  }

  getProducts(): Observable<Array<Product>> {
  	return this.http.get<Array<Product>>(this.productUrl)
  		.pipe(
  			catchError(this.handleError('Get Token', null)));
  }

  getStoreFullProductList(storeid): Observable<Array<any>> {
  	return this.http.get<Array<any>>(`${this.productUrl}/getStoreFullProductList/${storeid}`)
  		.pipe(
  			catchError(this.handleError('Get Token', null)));
  }

  getProductsByCategory(selectedCategoryId: string): Observable<any> {
  	return this.http.get<any>(`${this.productUrl}/getProductByCategoryId?categoryId=${selectedCategoryId}`)
  		.pipe(
  			catchError(this.handleError('Get Token', null)));
  }

  getProductsByTaxonomy(taxonomy: string): Observable<any> {
  	return this.http.get<any>(`${this.productUrl}/getProductByTaxonomy?taxonomy=${taxonomy}`)
  		.pipe(
  			catchError(this.handleError('Get Token', null)));
  }

  getProductById(productId): Observable<Array<Product>>{
    return this.http.get<Array<Product>>(`${this.productUrl}/${productId}`)
      .pipe(
        catchError(this.handleError('Get Token', null))); 
  }

  getByIds(ids): Observable<Array<Product>>{
    return this.http.get<Product>(`${this.productUrl}/getByIds?productIds=${ids}`)
      .pipe(
        catchError(this.handleError('Get Token', null))); 
  }

  getByProductIdList(ids: string):Observable<Array<Product>>{
    return this.http.get<Product>(`${this.productUrl}/getProductByIds?productIds=${ids}`)
      .pipe(
        catchError(this.handleError('Get Token', null))); 
  }

  getByFilter(filterCriteria): Observable<Array<Product>>{
    var criteriaStr = "";
    for(var criteria in filterCriteria){
      if(criteriaStr.length>0){
        criteriaStr = `${criteriaStr}&${criteria}=${filterCriteria[criteria]}`;
      }else{
        criteriaStr = `${criteria}=${filterCriteria[criteria]}`;
      }
    }
    return this.http.get<Product>(`${this.productUrl}/getByFilter?${criteriaStr}`)
      .pipe(
        catchError(this.handleError('Get Token', null))); 
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
