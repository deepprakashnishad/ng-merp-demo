import { Injectable, Inject } from '@angular/core';
import { environment } from './../../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Section } from './section';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { NotifierService } from 'angular-notifier';

@Injectable({
  providedIn: 'root'
})
export class SectionService {

	sectionUrl: string;

  constructor(
  	private http: HttpClient,
    private notifier: NotifierService
  ) {
     this.sectionUrl = environment.baseurl + '/Section';
  }

  getSections(query=""): Observable<Array<Section>> {
	return this.http.get<Array<Section>>(`${this.sectionUrl}?${query}`)
	.pipe(
		catchError(this.handleError('Get Token', null)));
  }

  getSectionById(sectionId): Observable<Section>{
    return this.http.get<Section>(`${this.sectionUrl}/getSections/${sectionId}`)
      .pipe(
        catchError(this.handleError('Get Token', null))); 
  }

  add(section): Observable<Section> {
    return this.http.post<Section>(`${this.sectionUrl}`, section)
    .pipe(
       catchError(this.handleError('Add Section', null)));
  }

  update(section): Observable<Section> {
    return this.http.put<Section>(`${this.sectionUrl}`, section)
      .pipe(
        catchError(this.handleError('Update Section', null))
      )
  }

  updateProductIds(sectionId, productIds){
    return this.http.put<Section>(`${this.sectionUrl}`, {
      "id": sectionId,
      "productIds": productIds
    })
    .pipe(
      catchError(this.handleError('Update Section', null))
    )
  }

  delete(sectionId): Observable<Section> {
     return this.http.delete<Section>(`${this.sectionUrl}/${sectionId}`)
    .pipe(
       catchError(this.handleError('Delete section', null)));
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
    	if (error instanceof ErrorEvent) {
        this.notifier.notify("error", 'Unable to submit request. Please check your internet connection.');
    		return throwError('Unable to submit request. Please check your internet connection.');
    	} else {
        this.notifier.notify("error", error.error.msg);
    		return throwError(error);
    	}
    };
  }
}
