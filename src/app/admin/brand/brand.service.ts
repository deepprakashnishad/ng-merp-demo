import { Injectable, Inject } from '@angular/core';
import { environment } from './../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Brand } from './brand';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BrandService {

	brandUrl: string;

  constructor(
  	private http: HttpClient,
  ) {
     this.brandUrl = environment.baseurl + '/brand';
  }

  getBrands(): Observable<Array<Brand>> {
  	return this.http.get<Brand>(this.brandUrl)
  		.pipe(
  			catchError(this.handleError('Get Token', null)));
  }

  addBrand(brand): Observable<Brand> {
    return this.http.post<Brand>(this.brandUrl, brand)
    .pipe(
       catchError(this.handleError('Add Brand', null)));
  }

  updateBrand(brand): Observable<Brand> {
    return this.http.put<Brand>(this.brandUrl, brand)
      .pipe(
        catchError(this.handleError('Update Brand', null))
      )
  }

  updateBrandPermissions(brand): Observable<Brand> {
    return this.http.put<Brand>(this.brandUrl+"/updatePermissionCollection", brand)
      .pipe(
        catchError(this.handleError('Update brand permission collection', null))
      )
  }

  deleteBrand(brandId): Observable<Brand> {
     return this.http.delete<Brand>(this.brandUrl +'/'+ brandId)
    .pipe(
       catchError(this.handleError('Delete Brand', null)));
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
