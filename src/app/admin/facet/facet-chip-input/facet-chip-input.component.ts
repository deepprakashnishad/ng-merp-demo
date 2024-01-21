import { Component, OnInit, 
		ViewChild, EventEmitter, 
		ElementRef, Inject, 
		Input, OnChanges, SimpleChange } from '@angular/core';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { MatAutocompleteSelectedEvent, MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatChipInputEvent, } from '@angular/material/chips';
import { FormControl } from '@angular/forms';
import { BehaviorSubject, Observable, of as observableOf } from 'rxjs';
import { map, startWith, switchMap, filter } from 'rxjs/operators';
import { FacetService } from '../../facet/facet.service';

import { Facet } from '../../facet/facet';
import { NotifierService } from 'angular-notifier';


@Component({
  selector: 'app-facet-chip-input',
  templateUrl: './facet-chip-input.component.html',
  styleUrls: ['./facet-chip-input.component.scss']
})
export class FacetChipInputComponent implements OnInit {

	@Input()
	public facet: Facet;
	@Input()
	public isRemoveOnSeverFlag: boolean = false;
	@Input()
	public isSelection: boolean = false;
	@Input()
	public addOnSeverFlag: boolean = true;

	
	@Input()
	selectedValues: Array<string>=[];
  	filteredList: Observable<String[]>;
  	facetControl=new FormControl();
  	readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  	@ViewChild('facetInput') facetInput: ElementRef<HTMLInputElement>;
	@ViewChild('facetInputTrigger', {read: MatAutocompleteTrigger}) facetInputTrigger: MatAutocompleteTrigger;
  	@ViewChild('facetAuto') facetAuto: MatAutocomplete;
  	
  	constructor(
  		private facetService: FacetService,
		private notifier: NotifierService
  	) { }

  	ngOnInit() {
  		// this.subscribeInput();
  	}

	subscribeInput(){
		this.filteredList = this.facetControl.valueChanges.pipe(
			startWith(''),
			map((filterStr: string) => {
			  var list = this._filter(filterStr, this.facet.values)
			  return list;
			}));
	}

	openPanel(){
		this.facetInputTrigger.openPanel();
	}

  	ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
	    for (let propName in changes) {
	    	let changedProp = changes[propName];
	    	if(propName.toLowerCase() === "facet" && changedProp.currentValue !== undefined){
					if(!this.isSelection){
						this.selectedValues = changedProp.currentValue['values'];
					}
					this.subscribeInput();
	    	}
	    }
	}


  	_filter(value:string, list: Array<any>): Array<any>{
	    if(list && value && typeof value==="string"){
	      	const filterValue = value.toLowerCase();
	        var list = list.filter(option => option.toLowerCase().includes(filterValue) 
	        	&& this.selectedValues.indexOf(option)<0);  
	        return list;
	    } else if(list){
			return list;
	    //   return list.filter(option => this.facet.values.indexOf(option)<0);
	    }
	  } 

	selected(event: MatAutocompleteSelectedEvent){
	    this.selectedValues.push(event.option.value);
	    this.facetControl.setValue(null);
	    this.facetInput.nativeElement.value='';
	}

	remove(value: string): void {
	    const index = this.selectedValues.indexOf(value);

	    if (index >= 0) {
	      this.selectedValues.splice(index, 1);
	    }

	    if(this.isRemoveOnSeverFlag){
	    	this.facetService.updateFacet(this.facet)
	      	.subscribe((facet)=>{

	      	}, (err)=>alert("Failed to delete facet value"));	
	    }
	}

	add(event: MatChipInputEvent): void {
	    const input = event.input;
	    const value = event.value;

	    // Add our facet
	    if (value.trim() !== "" && !this.facetAuto.isOpen) {
			this.selectedValues.push(value);
			if(this.addOnSeverFlag && this.facet.values.indexOf(value)<0){
				this.facet.values.push(value);
				this.facetService.updateFacet(this.facet)
				.subscribe((facet)=>{

				}, (err)=>this.notifier.notify("error","Could not create facet value"));
			}
	    }

	    // Reset the input value
	    if (input) {
	      input.value = '';
	    }
	}

	getFacetValues(): any{
		return {facet: this.facet, values: this.selectedValues};
	}

	resetSelectedValues(){
		this.selectedValues = [];
	}
}
