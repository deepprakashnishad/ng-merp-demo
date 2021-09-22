import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Rating } from './rating';

@Injectable({
  providedIn: 'root'
})
export class RatingService {

  ratingUrl: string;

  constructor(
  	private http: HttpClient,
  ) {
     this.ratingUrl = environment.baseurl+'/rating';
  }

  get(): Observable<Array<Rating>> {
  	return this.http.get<Rating>(this.ratingUrl)
  		.pipe(
  			catchError(this.handleError('Get Token', null)));
  }

  add(rating): Observable<Rating> {
    return this.http.post<Rating>(this.ratingUrl, rating)
    .pipe(
       catchError(this.handleError('Add Rating', null)));
  }

  update(rating): Observable<Rating> {
    return this.http.put<Rating>(this.ratingUrl, rating)
      .pipe(
        catchError(this.handleError('Update Rating', null))
      )
  }

  updatePermissions(rating): Observable<Rating> {
    return this.http.patch<Rating>(this.ratingUrl+"/updatePermissionCollection", rating)
      .pipe(
        catchError(this.handleError('Update Rating permission collection', null))
      )
  }

  delete(ratingId): Observable<Rating> {
     return this.http.delete<Rating>(this.ratingUrl +'/'+ ratingId)
    .pipe(
       catchError(this.handleError('Delete Rating', null)));
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
