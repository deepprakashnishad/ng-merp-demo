import { Injectable, Inject } from '@angular/core';
import { environment } from './../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Variant } from './variant';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class VariantService {

	variantUrl: string;

  constructor(
  	private http: HttpClient,
  ) {
     this.variantUrl = environment.baseurl + '/variant';
  }

  getVariantsByProductId(productId): Observable<Array<Variant>> {
	return this.http.get<Array<Variant>>(`${this.variantUrl}/getByProductId/${productId}`)
	.pipe(
		catchError(this.handleError('Get Token', null)));
  }

  getVariantById(variantId): Observable<Variant>{
    return this.http.get<Variant>(`${this.variantUrl}/getById/${variantId}`)
      .pipe(
        catchError(this.handleError('Get Token', null))); 
  }

  addVariant(variant): Observable<Variant> {
    return this.http.post<Variant>(this.variantUrl, variant)
    .pipe(
       catchError(this.handleError('Add Variant', null)));
  }

  updateVariant(variant): Observable<Variant> {
    return this.http.put<Variant>(this.variantUrl, variant)
      .pipe(
        catchError(this.handleError('Update Variant', null))
      )
  }

  deleteVariant(variantId): Observable<Variant> {
     return this.http.delete<Variant>(this.variantUrl +'/'+ variantId)
    .pipe(
       catchError(this.handleError('Delete variant', null)));
  }

  removeVariantImage(data): Observable<Variant>{
    return this.http.patch<Variant>(this.variantUrl+'/removeVariantImage', data)
    .pipe(
       catchError(this.handleError('Delete variant image', null))); 
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
