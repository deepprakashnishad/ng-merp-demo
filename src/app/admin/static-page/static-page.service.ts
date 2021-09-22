import { Injectable, Inject } from '@angular/core';
import { environment } from './../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Page } from './page';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StaticPageService {

	pageUrl: string;

  constructor(
  	private http: HttpClient,
  ) {
     this.pageUrl = environment.baseurl + '/StaticPage';
  }

  getPages(): Observable<Array<Page>> {
	return this.http.get<Array<Page>>(`${this.pageUrl}/getPages`)
	.pipe(
		catchError(this.handleError('Get Token', null)));
  }

  getPageByQuery(filter): Observable<Page>{
    var url = `${this.pageUrl}/getPages?`;
    if(filter['id']){
      url = `${url}id=${filter['id']}&`;
    }
    if(filter['routeName']){
      url = `${url}routeName=${filter['routeName']}`;
    }
    return this.http.get<Page>(url)
      .pipe(
        catchError(this.handleError('Get Token', null))); 
  }

  addPage(page): Observable<Page> {
    return this.http.post<Page>(`${this.pageUrl}/createStaticPage`, page)
    .pipe(
       catchError(this.handleError('Add Page', null)));
  }

  updatePage(page): Observable<Page> {
    return this.http.put<Page>(`${this.pageUrl}/updateStaticPage`, page)
      .pipe(
        catchError(this.handleError('Update Page', null))
      )
  }

  deletePage(pageId): Observable<Page> {
     return this.http.delete<Page>(`${this.pageUrl}/deleteStaticPage/${pageId}`)
    .pipe(
       catchError(this.handleError('Delete page', null)));
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // Let the app keep running by returning an empty result.
    	if (error instanceof ErrorEvent) {
        console.log(error);
    		return throwError('Unable to submit request. Please check your internet connection.');
    	} else {
    		return throwError(error);
    	}
    };
  }
}
