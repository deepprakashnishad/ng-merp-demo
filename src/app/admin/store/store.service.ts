import { Injectable, Inject } from '@angular/core';
import { environment } from './../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Store } from './store';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { StoreSettings as any } from '../store-settings/store-setting';
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  storeUrl: string;
  stores: Array<Store>

  constructor(
    private http: HttpClient,
    private afs: AngularFireStorage
  ) {
      this.storeUrl = environment.baseurl + '/store';
  }

  getStoreByName(storeName){
    if(this.stores !== undefined){
      for(var i=0;i<this.stores.length;i++){
        if(storeName === this.stores[i].title){
          return this.stores[i];
        }
      } 
    }   
    return null;
  }

  getMyStores(): Observable<any> {
    return this.http.get<any>(`${this.storeUrl}/myStores`)
      .pipe(
        catchError(this.handleError('Get Token', null)));
  }

  getStores(): Observable<Array<Store>> {
    return this.http.get<Store>(this.storeUrl)
      .pipe(
        catchError(this.handleError('Get Token', null)));
  }

  update(store: Store): Observable<any> {
    return this.http.put<Store>(this.storeUrl, store)
      .pipe(
        catchError(this.handleError('Update store settings', null)));
  }

  create(store: any): Observable<any> {
    return this.http.post<any>(this.storeUrl, store)
      .pipe(
        catchError(this.handleError('Create store settings', null)));
  }

  deleteImage(event, index) {
    this.afs.ref(event['uploadPath']).delete().subscribe(result => {
      console.log(result);
    });
  }

  addStore(store): Observable<Store> {
    return this.http.post<Store>(this.storeUrl, store)
    .pipe(
       catchError(this.handleError('Add Store', null)));
  }

  updateStore(store): Observable<Store> {
    return this.http.put<Store>(this.storeUrl, store)
      .pipe(
        catchError(this.handleError('Update Store', null))
      )
  }

  updateStorePermissions(store): Observable<Store> {
    return this.http.put<Store>(this.storeUrl+"/updatePermissionCollection", store)
      .pipe(
        catchError(this.handleError('Update store permission collection', null))
      )
  }

  deleteStore(storeId): Observable<Store> {
     return this.http.delete<Store>(this.storeUrl +'/'+ storeId)
    .pipe(
       catchError(this.handleError('Delete Store', null)));
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
