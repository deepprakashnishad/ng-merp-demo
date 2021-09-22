import { Component, EventEmitter, OnInit, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { startWith, debounceTime, distinctUntilChanged, switchMap, map, filter } from 'rxjs/operators';
import { CategoryService } from 'src/app/admin/category/category.service';
import { STRING_SEARCH } from '../product/product-list/product-list.component';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent implements OnInit {

  @Input() selectedOption: any;
	@Output() optionSelected = new EventEmitter<any>();

	mCntl: FormControl = new FormControl();
	options: Array<any>;
	optionFilteredList: Observable<any[]>;

  constructor(
    private categoryService: CategoryService,
    private router: Router
  ) { }

  ngOnInit() {
    this.optionFilteredList = this.mCntl.valueChanges
      .pipe(
        startWith(''),
        debounceTime(800),
        filter(val => val.length>1),
        distinctUntilChanged(),
        switchMap(val => {
          return this._filter(val || '')
        })       
      );
  }

  _filter(value:string): Observable<Array<any>>{
    return this.categoryService.getSearchOptions(value)
     .pipe(
       map(response => response.filter(option => { 
         return option.displayName.toLowerCase().indexOf(value.toLowerCase()) > -1
       }))
    );
  }  
	 

	displayFn(option?: any): string | undefined {
    return option?.displayName?option.displayName: undefined;
	}

	selected($event){
		this.selectedOption = $event.option.value;
		this.optionSelected.emit(this.selectedOption);

    this.router.navigate(['/product-list'], {
      queryParams: {
        searchType: STRING_SEARCH, 
        text: this.selectedOption.displayName,
        type: this.selectedOption.type
      }
    });
	}

}
