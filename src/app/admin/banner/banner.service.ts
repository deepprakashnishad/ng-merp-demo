import { Injectable, Inject } from '@angular/core';
import { environment } from './../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Banner } from './banner';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BannerService {

  bannerUrl: string;
  banners: Array<Banner>

  constructor(
    private http: HttpClient,
  ) {
      this.bannerUrl = environment.baseurl + '/banner';
      this.getBanners()
        .subscribe(banners=>{
        this.banners = banners;
      });
  }

  getBanners(): Observable<Array<Banner>> {
    return this.http.get<Banner>(this.bannerUrl)
      .pipe(
        catchError(this.handleError('Get Token', null)));
  }

  addBanner(banner): Observable<Banner> {
    return this.http.post<Banner>(this.bannerUrl, banner)
    .pipe(
       catchError(this.handleError('Add Banner', null)));
  }

  updateBanner(banner): Observable<Banner> {
    return this.http.put<Banner>(this.bannerUrl, banner)
      .pipe(
        catchError(this.handleError('Update Banner', null))
      )
  }

  deleteBanner(bannerId): Observable<Banner> {
     return this.http.delete<Banner>(this.bannerUrl +'/'+ bannerId)
    .pipe(
       catchError(this.handleError('Delete Banner', null)));
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
