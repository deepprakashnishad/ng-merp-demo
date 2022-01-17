import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { map, startWith, switchMap, filter } from 'rxjs/operators';
import { BehaviorSubject, Observable, of as observableOf } from 'rxjs';
import { StoreService } from './../store.service';
import { Store } from './../store';

@Component({
  selector: 'app-store-selector',
  templateUrl: './store-selector.component.html',
  styleUrls: ['./store-selector.component.scss']
})
export class StoreSelectorComponent implements OnInit {

	@Input() tabIndex="100";
	@Input() store: Store;
	@Output() storeSelected = new EventEmitter<Store>();

	storeControl: FormControl = new FormControl();
	stores: Array<Store>;
	storeFilteredList: Observable<any[]>;

	constructor(
	  	private storeService: StoreService
	) { }

  	ngOnInit() {
  		this.storeService.getStores()
	  	.subscribe((stores)=>{
	  		this.stores = stores;
	  		this.storeControl.setValue(this.stores[0]);
	  		this.store = this.stores[0];
	  		this.storeSelected.emit(this.store);	
	  	});

	  	this.storeFilteredList = this.storeControl.valueChanges.pipe(
	    startWith(''),
	    map((filterStr: string | null) => {
	      return this._filter(filterStr, this.stores)
	    }));
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

	displayFn(store?: Store): string | undefined {
	    return store ? store.title : undefined;
	}

	selected($event){
		this.store = $event.option.value;
		this.storeSelected.emit(this.store);
	}
}
