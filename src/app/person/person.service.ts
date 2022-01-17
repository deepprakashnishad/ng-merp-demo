import { Injectable, Inject } from '@angular/core';
import { environment } from './../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Person } from './person';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { NotifierService } from 'angular-notifier';

@Injectable({
  providedIn: 'root'
})
export class PersonService {

	PersonUrl: string;
  UserLoginUrl: string;

  	constructor(
  	private http: HttpClient,
    private notifier: NotifierService
  ) {
     this.PersonUrl = environment.baseurl+'/Person';
     this.UserLoginUrl = environment.baseurl+'/UserLogin';
  }

  get(limit, offset): Observable<Array<Person>> {
  	return this.http.get<Person>(this.PersonUrl)
  		.pipe(
  			catchError(this.handleError('Get Token', null)));
  }

  getCustomers(limit, offset, searchStr:string='') {
    return this.http.get<Person>(`${this.PersonUrl}/queryCustomers?q=${searchStr}&l=${limit}&o=${offset}`)
      .pipe(
        catchError(this.handleError('Get Customers', null)));
  }

  getTotalCustomers() {
    return this.http.get<Person>(`${this.PersonUrl}/getTotalCustomers`)
      .pipe(
        catchError(this.handleError('Get Customers', null)));
  }

  fetchFilteredPersonList(strQuery: any, limit: number, offset: number): Observable<Array<Person>> {
    let mUrl = `${this.PersonUrl}/get?strQuery=${strQuery}&limit=${limit}&offset=${offset}`;
  	return this.http.get<Person>(mUrl)
  		.pipe(
  			catchError(this.handleError('Get Token', null)));
  }

  add(person): Observable<Person> {
    return this.http.post<Person>(this.PersonUrl, person)
    .pipe(
       catchError(this.handleError('Add Person', null)));
  }

  update(Person): Observable<Person> {
    return this.http.put<Person>(this.PersonUrl, Person)
      .pipe(
        catchError(this.handleError('Update Person', null))
      )
  }

  resetPassword(personId: string, password: string): Observable<Person> {
    return this.http.put<Person>(`${this.UserLoginUrl}/resetUserPasswordByAdmin`, {"personId": personId, "password": password})
      .pipe(
        catchError(this.handleError('Reset Password', null))
      )
  }

  updatePermissions(Person): Observable<Person> {
    return this.http.patch<Person>(this.PersonUrl+"/updatePermissionCollection", Person)
      .pipe(
        catchError(this.handleError('Update Person permission collection', null))
      )
  }

  delete(PersonId): Observable<Person> {
     return this.http.delete<Person>(this.PersonUrl +'/'+ PersonId)
    .pipe(
       catchError(this.handleError('Delete Person', null)));
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // Let the app keep running by returning an empty result.
    	if (error instanceof ErrorEvent) {
    		return throwError('Unable to submit request. Please check your internet connection.');
    	} else {
        if(error['msg']){
          this.notifier.notify("error", error['msg']);
        }
    		return throwError(error);
    	}
    };
  }

}
