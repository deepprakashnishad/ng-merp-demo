import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  paymentUrl: string;
  pincodeTranslationUrl: string;

  constructor(
  	private http: HttpClient,
  ) {
     this.paymentUrl = environment.baseurl+'/payment';
  }

  checkOrderPayment( order_id, payment_id, transaction_id, pg_order_id, channel): Observable<any> {
  	return this.http.get<any>(`${this.paymentUrl}/checkPayment?order_id=${order_id}&payment_id=${payment_id}&transaction_id=${transaction_id}&pg_order_id=${pg_order_id}&channel=${channel}`)
  		.pipe(
  			catchError(this.handleError('Get order list', null)));
  }

  verifyRazorpayPayment(data): Observable<any> {
  	return this.http.post<any>(`${this.paymentUrl}/verifyRazorpayPayment`, data)
  		.pipe(
  			catchError(this.handleError('Verify Razorpay payment', null)));
  }

  retryPayment(data): Observable<any> {
    return this.http.post<any>(`${this.paymentUrl}/retryPayment`, data)
    .pipe(
       catchError(this.handleError('Retry Payment', null)));
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
