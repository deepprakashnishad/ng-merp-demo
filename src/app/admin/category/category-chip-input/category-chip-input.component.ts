import { Component, OnInit, ViewChild, EventEmitter, ElementRef, Inject, Input } from '@angular/core';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import {MatChipInputEvent } from '@angular/material/chips';
import { FormControl } from '@angular/forms';
import { BehaviorSubject, Observable, of as observableOf } from 'rxjs';
import { map, startWith, switchMap, filter } from 'rxjs/operators';
import { CategoryService } from '../../category/category.service';

import { Category } from '../../category/category';


@Component({
  selector: 'app-category-chip-input',
  templateUrl: './category-chip-input.component.html',
  styleUrls: ['./category-chip-input.component.scss']
})
export class CategoryChipInputComponent implements OnInit {

	@Input()
	inputLabel:string = "Categories";
	@Input()
	excludeCategory: Category;
	public categories: Array<Category>=[];
  	allCategories: Array<Category>;
  	categoryFilteredList: Observable<any[]>;
  	categoryControl=new FormControl();
  	readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  	@ViewChild('categoryInput') categoryInput: ElementRef<HTMLInputElement>;
  	@ViewChild('categoryAuto') categoryAuto: MatAutocomplete;
  	
  	constructor(
  		private categoryService: CategoryService,
  	) { }

  	ngOnInit() {
  		this.categoryService.getCategories().subscribe(categories => this.allCategories = categories);
	  	this.categoryFilteredList = this.categoryControl.valueChanges.pipe(
	    startWith(''),
	    map((filterStr: string | null) => {
	      return this._filter(filterStr, this.allCategories)
	    }));
  	}

  	_filter(value:string, list: Array<any>): Array<any>{
	    if(value && typeof value==="string"){
	      const filterValue = value.toLowerCase();
	        return list.filter(option => (option.title.toLowerCase()
	        	.includes(filterValue)) && this.categories.indexOf(option)<0
	        && option.title.toLowerCase() !== this.excludeCategory.title.toLowerCase());  
	    } else if(list){
	      return list.filter(option => this.categories.indexOf(option)<0);
	    }
	  } 

	selected(event: MatAutocompleteSelectedEvent){
	    this.categories.push(event.option.value);
	    this.categoryControl.setValue(null);
	    this.categoryInput.nativeElement.value='';
	}

	remove(category: Category): void {
	    const index = this.categories.indexOf(category);

	    if (index >= 0) {
	      this.categories.splice(index, 1);
	    }
	}

	add(event: MatChipInputEvent): void {
	    const input = event.input;
	    const value = event.value;

	    // Add our category
	    if (value.trim() !== "" && !this.categoryAuto.isOpen) {
	      this.categoryService.addCategory({title: value})
	      .subscribe((category)=>{
	      	this.categories.push(category);
	      	this.allCategories.push(category);
	      }, (err)=>alert("Could not create category"));
	    }

	    // Reset the input value
	    if (input) {
	      input.value = '';
	    }
	}
}

