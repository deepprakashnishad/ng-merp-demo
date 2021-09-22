import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Address } from './address';

@Injectable({
  providedIn: 'root'
})
export class AddressService {
  addressUrl: string;
  pincodeTranslationUrl: string;

  constructor(
  	private http: HttpClient,
  ) {
     this.addressUrl = environment.baseurl+'/address';
     this.pincodeTranslationUrl = "https://api.postalpincode.in/pincode/my_pincode";
  }

  get(forType): Observable<Array<Address>> {
  	return this.http.get<Address>(`${this.addressUrl}/${forType}`)
  		.pipe(
  			catchError(this.handleError('Get Token', null)));
  }

  add(address): Observable<Address> {
    return this.http.post<Address>(this.addressUrl, address)
    .pipe(
       catchError(this.handleError('Add Address', null)));
  }

  update(address): Observable<Address> {
    return this.http.put<Address>(this.addressUrl, address)
      .pipe(
        catchError(this.handleError('Update Address', null))
      )
  }

  updatePermissions(address): Observable<Address> {
    return this.http.patch<Address>(this.addressUrl+"/updatePermissionCollection", address)
      .pipe(
        catchError(this.handleError('Update Address permission collection', null))
      )
  }

  delete(addressId): Observable<Address> {
     return this.http.delete<Address>(this.addressUrl +'/'+ addressId)
    .pipe(
       catchError(this.handleError('Delete Address', null)));
  }

  getPincodeDetail(pincode: string) : Observable<Array<Address>> {
  	return this.http.get<any>(window.location.origin+"/api-pincode/"+pincode)
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
