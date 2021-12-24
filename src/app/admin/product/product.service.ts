import { Injectable, Inject } from '@angular/core';
import { environment } from './../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Product } from './product';
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
     this.productUrl = environment.baseurl + '/product';
  }

  bulkUploadProducts(products: Array<any>): Observable<any>{
    return this.http.post<Array<Product>>(`${this.productUrl}/bulkUpload`, products)
  		.pipe(
  			catchError(this.handleError('Get Token', null)));
  }

  getProducts(): Observable<Array<Product>> {
  	return this.http.get<Array<Product>>(this.productUrl)
  		.pipe(
  			catchError(this.handleError('Get Token', null)));
  }

  getProductsByStoreId(storeId): Observable<Array<Product>> {
  	return this.http.get<Array<Product>>(`${this.productUrl}/getByStoreId/${storeId}`)
  		.pipe(
  			catchError(this.handleError('Get Token', null)));
  }

  getStoreFullProductList(storeid): Observable<any> {
  	return this.http.get<any>(`${environment.baseurl}/shoppin/getStoreFullProductList/${storeid}`)
  		.pipe(
  			catchError(this.handleError('Get Token', null)));
  }

  getProductsByCategory(selectedCategoryId: string): Observable<any> {
  	return this.http.get<any>(`${this.productUrl}/getProductByCategoryId?categoryId=${selectedCategoryId}`)
  		.pipe(
  			catchError(this.handleError('Get Token', null)));
  }

  getProductById(productId): Observable<Product>{
    return this.http.get<Product>(`${this.productUrl}/${productId}`)
      .pipe(
        catchError(this.handleError('Get Token', null))); 
  }

  getByIds(ids): Observable<Array<Product>>{
    return this.http.get<Product>(`${this.productUrl}/getByIds?productIds=${ids}`)
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

  getBySearchText(filterCriteria): Observable<Array<Product>>{
    return this.http.get<Product>(`${this.productUrl}/getBySearchText?q=${filterCriteria}`)
      .pipe(
        catchError(this.handleError('Get Token', null))); 
  }

  addProduct(product): Observable<Product> {
    return this.http.post<Product>(this.productUrl, product)
    .pipe(
       catchError(this.handleError('Add Product', null)));
  }

  updateProduct(product): Observable<Product> {
    return this.http.put<Product>(this.productUrl, product)
      .pipe(
        catchError(this.handleError('Update Product', null))
      )
  }

  updateProductPriceInventory(data) {
    return this.http.put<Product>(this.productUrl+"/updateProductPriceInventory", data)
      .pipe(
        catchError(this.handleError('Update Product', null))
      )
  }

  deleteProduct(productId): Observable<Product> {
     return this.http.delete<Product>(this.productUrl +'/'+ productId)
    .pipe(
       catchError(this.handleError('Delete product', null)));
  }

  removeProductImage(data): Observable<Product>{
    return this.http.patch<Product>(this.productUrl+'/removeProductImage', data)
    .pipe(
       catchError(this.handleError('Delete product image', null))); 
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
