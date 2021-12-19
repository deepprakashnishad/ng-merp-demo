import { Injectable, Inject } from '@angular/core';
import { environment } from './../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Facet } from './facet';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FacetService {

  facetUrl: string;
  facets: Array<Facet>

  constructor(
    private http: HttpClient,
  ) {
      this.facetUrl = environment.baseurl + '/facet';
      this.getFacets()
        .subscribe(facets=>{
        this.facets = facets;
      });
  }

  isFacetsInitialized(){
    return this.facets!==undefined && this.facets!==null;
  }

  getFacetByName(facetName){
    // console.log(this.facets);
    if(this.facets !== undefined){
      for(var i=0;i<this.facets.length;i++){
        if(facetName === this.facets[i].title){
          return this.facets[i];
        }
      } 
    }   
    return null;
  }

  getFacets(): Observable<Array<Facet>> {
    return this.http.get<Facet>(this.facetUrl)
      .pipe(
        catchError(this.handleError('Get Token', null)));
  }

  addFacet(facet): Observable<Facet> {
    return this.http.post<Facet>(this.facetUrl, facet)
    .pipe(
       catchError(this.handleError('Add Facet', null)));
  }

  updateFacet(facet): Observable<Facet> {
    return this.http.put<Facet>(this.facetUrl, facet)
      .pipe(
        catchError(this.handleError('Update Facet', null))
      )
  }

  updateFacetPermissions(facet): Observable<Facet> {
    return this.http.put<Facet>(this.facetUrl+"/updatePermissionCollection", facet)
      .pipe(
        catchError(this.handleError('Update facet permission collection', null))
      )
  }

  deleteFacet(facetId): Observable<Facet> {
     return this.http.delete<Facet>(this.facetUrl +'/'+ facetId)
    .pipe(
       catchError(this.handleError('Delete Facet', null)));
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
