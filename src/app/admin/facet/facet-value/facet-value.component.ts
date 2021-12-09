import { Component, OnInit, Input, Output, EventEmitter, ViewChildren, QueryList, SimpleChange, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { map, startWith, switchMap, filter } from 'rxjs/operators';
import { BehaviorSubject, Observable, of as observableOf } from 'rxjs';

import {FacetChipInputComponent} from './../facet-chip-input/facet-chip-input.component';

import { FacetService } from './../facet.service';
import { Facet } from './../facet';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';

@Component({
  selector: 'app-facet-value',
  templateUrl: './facet-value.component.html',
  styleUrls: ['./facet-value.component.scss']
})
export class FacetValueComponent implements OnInit {

	@Output() facetValuesSelected: EventEmitter<any> = new EventEmitter();

	@ViewChildren(FacetChipInputComponent)
	private facetValueChipInputComponents !: QueryList<FacetChipInputComponent>;

	@Input()
	facetJson: any;

	@Input()
	facets: Array<Facet>;

	@Input()
	showSaveButton: boolean = true;

	facetValuesMap = new Map<Facet, Array<string>>();

	facetControl: FormControl = new FormControl();
	facet: Facet;
	
	facetFilteredList: Observable<any[]>;

  	constructor(
  		private facetService: FacetService
  	) { }

  	ngOnInit() {
  		if(this.facets===undefined){
	  		this.facetService.getFacets()
		  	.subscribe((facets)=>{
		  		this.facets = facets;
				this.facetFilteredList = this.facetControl.valueChanges.pipe(
				startWith(''),
				map((filterStr: string | null) => {
					return this._filter(filterStr, this.facets)
				}));
		  	});
		}
  	}

  	ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
	    for (let propName in changes) {
	      let changedProp = changes[propName];
	      if (propName === "facetJson" && changedProp.currentValue) {
	        this.facetJson = changedProp.currentValue;
	        if(this.facetJson !== undefined){
	        	if(this.facets){
	        		this.populateFacetValuesMap();
	        	}else{
	        		this.facetService.getFacets()
				  	.subscribe((facets)=>{
				  		this.facets = facets;
				  		this.populateFacetValuesMap();
				  	});
	        	}	    	    		
	        }	        
	      }
	    }
	}

	populateFacetValuesMap(){
		this.facetValuesMap.clear();
		for(var key in this.facetJson){
			this.facetValuesMap.set(
				this.facetService.getFacetByName(key), this.facetJson[key].split(",")
			);
	    }
	}

	delete(entry){
		this.facetValuesMap.delete(entry.key);
		if(!this.showSaveButton){
			this.emitFacetValues();
		}
	}

  	_filter(value:string, list: Array<any>): Array<any>{
	    if(value && typeof value==="string"){
	      const filterValue = value.toLowerCase();
	        return list.filter(option => (option.title.toLowerCase()
	        	.includes(filterValue)));  
	    } else if(list){
	      return list;
	    }
	} 

	displayFn(facet?: Facet): string | undefined {
	    return facet ? facet.title : undefined;
	}

	selected($event){
		this.facet = $event.option.value;
	}

	saveFacetValue(){
		var cnt = this.facetValueChipInputComponents.length;
		let result = this.facetValueChipInputComponents.last.getFacetValues();
		this.facetValuesMap.set(result.facet, result.values);
		this.facet=undefined;
		this.facetControl.setValue("");
		this.facetValueChipInputComponents.last.resetSelectedValues();
		if(!this.showSaveButton){
			this.emitFacetValues();
		}
	}

	emitFacetValues(){
		let result = {};
		this.facetValuesMap.forEach((value: Array<string>, key: Facet)=>{
			result[key.title] = value.join();
		});
		this.facetValuesSelected.emit(result);
	}
}
