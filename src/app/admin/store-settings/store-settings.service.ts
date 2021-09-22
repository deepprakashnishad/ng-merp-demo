import { Injectable, Inject } from '@angular/core';
import { environment } from './../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { StoreSettings } from './store-setting';
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class StoreSettingsService {

  private storeSettingUrl: string;
  private uploadPath: string = "/logo";

  constructor(
    private http: HttpClient,
    private afs: AngularFireStorage
  ) {
    this.storeSettingUrl = environment.baseurl + '/store-setting';
  }

  getStoreSettings(): Observable<StoreSettings> {
    return this.http.get<StoreSettings>(`${this.storeSettingUrl}`)
      .pipe(
        catchError(this.handleError('Get Token', null)));
  }

  update(storeSettings: StoreSettings): Observable<StoreSettings> {
    return this.http.put<StoreSettings>(this.storeSettingUrl, storeSettings)
      .pipe(
        catchError(this.handleError('Update store settings', null)));
  }

  create(storeSettings: StoreSettings): Observable<StoreSettings> {
    return this.http.post<StoreSettings>(this.storeSettingUrl, storeSettings)
      .pipe(
        catchError(this.handleError('Create store settings', null)));
  }

  deleteImage(event, index) {
    this.afs.ref(event['uploadPath']).delete().subscribe(result => {
      console.log(result);
    });
  }

  private handleError<T>(operation = 'operation', result?: T) {
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
