import { Component, OnInit, Input, Output, EventEmitter, SimpleChange } from '@angular/core';
import { FormControl } from '@angular/forms';
import { map, startWith, switchMap, filter } from 'rxjs/operators';
import { BehaviorSubject, Observable, of as observableOf } from 'rxjs';
import { VariantService } from './../../variant.service';
import { Variant } from './../../variant';

@Component({
  selector: 'app-variant-selector',
  templateUrl: './variant-selector.component.html',
  styleUrls: ['./variant-selector.component.scss']
})
export class VariantSelectorComponent implements OnInit {

	@Input() variant: Variant;
	@Input() productId: string;
	@Output() variantSelected = new EventEmitter<Variant>();

	variantControl: FormControl = new FormControl();
	variants: Array<Variant>;
	variantFilteredList: Observable<any[]>;

	constructor(
	  	private variantService: VariantService
	) { }

  	ngOnInit() {
  		this.variantFilteredList = this.variantControl.valueChanges.pipe(
	    startWith(''),
	    map((filterStr: string | null) => {
	      return this._filter(filterStr, this.variants)
	    }));
  	}

  	ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
  		for (let propName in changes) {
	    	if (propName === "productId") {
		        this.productId = changes[propName].currentValue;
		        if(this.productId){
					this.variantService.getVariantsByProductId(this.productId)
				  	.subscribe((variants)=>{
				  		this.variants = variants;
				  	});        	    	  
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

	displayFn(variant?: Variant): string | undefined {
	    return variant ? variant.name : undefined;
	}

	selected($event){
		this.variant = $event.option.value;
		this.variantSelected.emit(this.variant);
	}
}
