import { Injectable, Inject } from '@angular/core';
import { environment } from './../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { retry, catchError, tap } from 'rxjs/operators';
import { Category } from './category';
import { CategoryTreeNode } from './CategoryTreeNode';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

	categoryUrl: string;
  categoryTreeUrl: string;

  constructor(
  	private http: HttpClient,
  ) {
     this.categoryUrl = environment.baseurl + '/category';
     this.categoryTreeUrl = environment.baseurl + '/CategoryTree'
  }

  getDepartments(): Observable<Array<Category>> {
  	return this.http.get<Category>(`${this.categoryUrl}?isDepartment=true`)
  		.pipe(
  			catchError(this.handleError('Get Token', null)));
  }

  getCategories(): Observable<Array<Category>> {
  	return this.http.get<Category>(this.categoryUrl)
  		.pipe(
  			catchError(this.handleError('Get Token', null)));
  }

  addCategory(category): Observable<Category> {
    return this.http.post<Category>(this.categoryUrl, category)
    .pipe(
       catchError(this.handleError('Add Category', null)));
  }

  updateCategory(category): Observable<Category> {
    return this.http.put<Category>(this.categoryUrl, category)
      .pipe(
        catchError(this.handleError('Update Category', null))
      )
  }

  updateCategoryPermissions(category): Observable<Category> {
    return this.http.put<Category>(this.categoryUrl+"/updatePermissionCollection", category)
      .pipe(
        catchError(this.handleError('Update category permission collection', null))
      )
  }

  deleteCategory(categoryId): Observable<Category> {
     return this.http.delete<Category>(this.categoryUrl +'/'+ categoryId)
    .pipe(
       catchError(this.handleError('Delete Category', null)));
  }

  addCategoryNode(category, parent): Observable<any> {
    return this.http.post<CategoryTreeNode>(
      this.categoryTreeUrl, 
      {category: category, parent: parent})
    .pipe(
       catchError(this.handleError('Add Category', null)));
  }

  updateCategoryNode(category): Observable<CategoryTreeNode> {
    return this.http.put<CategoryTreeNode>(this.categoryTreeUrl, category)
      .pipe(
        catchError(this.handleError('Update Category', null))
      )
  }  

  deleteCategoryNode(nodeId): Observable<CategoryTreeNode> {
    return this.http.delete<CategoryTreeNode>(this.categoryTreeUrl+'/'+nodeId)
    .pipe(
       catchError(this.handleError('Delete Category', null)));
  }

  fetchCategoryTree(populateCategory: boolean = false, onlyDepartments: boolean = false): Observable<Array<CategoryTreeNode>>{
    return this.http.get<CategoryTreeNode>(
      `${this.categoryUrl}/fetchCategoryTree?populateCategory=${populateCategory}&onlyDepartments=${onlyDepartments}`
      )
      .pipe(
        catchError(this.handleError('Get Token', null)));   
  }

  getSearchOptions(searchStr): Observable<Array<any>> {
    var opts = [];
  	return opts.length ?
    of(opts) :
    this.http.get<any>(`${this.categoryUrl}/getSearchOptions?searchStr=${searchStr}`).pipe(tap(data => opts = data));
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
