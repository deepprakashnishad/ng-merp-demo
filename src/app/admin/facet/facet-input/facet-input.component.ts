import { Component, OnInit, ViewChild, EventEmitter, ElementRef, Inject, Input, Output } from '@angular/core';
import {COMMA, ENTER, I} from '@angular/cdk/keycodes';
import {  MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { FormControl } from '@angular/forms';
import { BehaviorSubject, Observable, of as observableOf } from 'rxjs';
import { map, startWith, switchMap, filter } from 'rxjs/operators';
import { FacetService } from '../../facet/facet.service';

import { Facet } from '../../facet/facet';
import { NotifierService } from 'angular-notifier';


@Component({
  selector: 'app-facet-input',
  templateUrl: './facet-input.component.html',
  styleUrls: ['./facet-input.component.scss']
})
export class FacetInputComponent implements OnInit {

	@Input()
	inputLabel : string = "Facets..."

	@Output()
	facetListModified: EventEmitter<Array<Facet>> = new EventEmitter();

	public facets: Array<Facet>=[];
  	allFacets: Array<Facet>;
  	facetFilteredList: Observable<any[]>;
  	facetControl=new FormControl();
  	readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  	@ViewChild('facetInput') facetInput: ElementRef<HTMLInputElement>;
  	@ViewChild('facetAuto') facetAuto: MatAutocomplete;
  	
  	constructor(
  		private facetService: FacetService,
		private notifier: NotifierService
  	) { }

  	ngOnInit() {
  		this.facetService.getFacets().subscribe(facets => {
			this.allFacets = facets
			this.facetFilteredList = this.facetControl.valueChanges.pipe(
			startWith(''),
			map((filterStr: string | null) => {
				return this._filter(filterStr, this.allFacets)
			}));
		});
  	}

  	_filter(value:string, list: Array<any>): Array<any>{
		if(this.facets === undefined){
			this.facets = [];
		}
	    if(value && typeof value==="string"){
	      const filterValue = value.toLowerCase();
	        return list.filter(option => (option.title.toLowerCase()
	        	.includes(filterValue)) && this.facets?.indexOf(option)<0);  
	    } else if(list){
	      return list.filter(option => this.facets?.indexOf(option)<0);
	    }
	  } 

	selected(event: MatAutocompleteSelectedEvent){
	    this.facets.push(event.option.value);
	    this.facetControl.setValue(null);
	    this.facetInput.nativeElement.value='';

		this.facetListModified.emit(this.facets);
	}

	remove(facet: Facet): void {
	    const index = this.facets.indexOf(facet);

	    if (index >= 0) {
	      this.facets.splice(index, 1);
	    }
	}

	add(event: MatChipInputEvent): void {
	    const input = event.input;
	    const value = event.value;

	    // Add our facet
	    if (value.trim() !== "" && !this.facetAuto.isOpen) {
	      this.facetService.addFacet({title: value, description:""})
	      .subscribe((facet)=>{
	      	this.facets.push(facet);
	      	this.allFacets.push(facet);
	      }, (err)=>this.notifier.notify("error", "Could not create facet"));
	    }

	    // Reset the input value
	    if (input) {
	      input.value = '';
	    }
	}
}
