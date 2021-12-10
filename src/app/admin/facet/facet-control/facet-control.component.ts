import { Component, SimpleChange, OnInit, Input, Output, EventEmitter, ViewChildren, QueryList } from '@angular/core';
import { FormControl } from '@angular/forms';
import { map, startWith, switchMap, filter } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { FacetService } from './../facet.service';
import { Facet } from './../facet';

@Component({
  selector: 'app-facet-control',
  templateUrl: './facet-control.component.html',
  styleUrls: ['./facet-control.component.scss']
})
export class FacetControlComponent implements OnInit {

	@Output()
	facetControlSelected: EventEmitter<any> = new EventEmitter();

	@Input()
	jsonFacetControl:Array<any> = [];

	queue: Map<Facet, string> = new Map();
  	facetControl: FormControl = new FormControl();
	facet: Facet;
	facets: Array<Facet>;
	facetFilteredList: Observable<any[]>;
	controlType: string = "toggle_button";

  	constructor(
  		private facetService: FacetService
  	) { }

  	ngOnInit() {
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

  	ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
  		for (let propName in changes) {
	      if (propName === "jsonFacetControl" && changes[propName].currentValue) {
	        this.jsonFacetControl = changes[propName].currentValue;
	        if(this.jsonFacetControl){
				this.queue.clear();
	        	for(var i=0;i<this.jsonFacetControl.length;i++){
					var mFacet = this.facetService.getFacetByName(this.jsonFacetControl[i].name);
					if(!this.queue.has(mFacet)){
						this.queue.set(mFacet, this.jsonFacetControl[i].dispType);
					}
		  		}	    	  
	        }	        
	      }
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

	addFacetControl(){
		if(!this.queue.has(this.facet)){
			this.queue.set(this.facet, this.controlType);
		}
		this.facet = undefined;
		this.facetControl.setValue("");
		this.controlType = "toggle_button";
	}

	emitFacetControls(){
		let variableFacets = [];
		this.jsonFacetControl = [];
		this.queue.forEach((value: string, key: Facet)=>{
			if(this.jsonFacetControl.some(ele=>ele.title===key.title) === false){
				this.jsonFacetControl.push({name: key.title, dispType: value});
			}
			variableFacets.push(key);
		});
		this.facetControlSelected.emit({variants: this.jsonFacetControl, variableFacets: variableFacets});
	}

	removeFacetControl(key){
		this.queue.delete(key);
	}
}
