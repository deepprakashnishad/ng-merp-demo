import { Injectable, Inject } from '@angular/core';
import { environment } from './../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DeliveryService {

  deliveryUrl: string;

  constructor(
    private http: HttpClient,
  ) {
      this.deliveryUrl = environment.baseurl + '/delivery';
  }

  bulkUploadPincodes(data: Array<any>): Observable<any> {
    return this.http.post<any>(this.deliveryUrl, data)
    .pipe(
       catchError(this.handleError('Upload pincode in bulk', null)));
  }

  checkPincodeAvailability(pincode) {
    return this.http.get<any>(
      `${this.deliveryUrl}/checkPincodeAvailability/${pincode}`)
      .pipe(
        catchError(this.handleError('Check pincode for delivery', null)));
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
