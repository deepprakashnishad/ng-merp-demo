import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { map, startWith, switchMap, filter } from 'rxjs/operators';
import { BehaviorSubject, Observable, of as observableOf } from 'rxjs';
import { BrandService } from './../brand.service';
import { Brand } from './../brand';
import { MatDialog } from '@angular/material/dialog';
import { NotifierService } from 'angular-notifier';
import { AddEditBrandComponent } from './../add-edit-brand/add-edit-brand.component';

@Component({
  selector: 'app-brand-selector',
  templateUrl: './brand-selector.component.html',
  styleUrls: ['./brand-selector.component.scss']
})
export class BrandSelectorComponent implements OnInit {

	@Input() brand: Brand;
	@Output() brandSelected = new EventEmitter<Brand>();

	brandControl: FormControl = new FormControl();
	brands: Array<Brand>;
	brandFilteredList: Observable<any[]>;

	constructor(
	  	private brandService: BrandService,
	  	private notifier: NotifierService,
	  	private dialog: MatDialog
	) { }

  	ngOnInit() {
  		this.brandService.getBrands()
	  	.subscribe((brands)=>{
        this.brands = brands;
        this.brandSelected.emit(this.brands[0]);
	  	});

	  	this.brandFilteredList = this.brandControl.valueChanges.pipe(
	    startWith(''),
	    map((filterStr: string | null) => {
	      return this._filter(filterStr, this.brands)
	    }));
  	}

	ngOnChanges(changes: SimpleChanges): void {
		//Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
		//Add '${implements OnChanges}' to the class.
    if (changes.brand && changes.brand.currentValue !== undefined) {
      if (typeof changes.brand.currentValue === "string") {
        for (var i = 0; i < this.brands.length; i++) {
          if (this.brands[i].id === changes.brand.currentValue) {
            this.brand = this.brands[i];
            break;
          }
        }
      } else {
        this.brand = changes.brand.currentValue;
      }
			
			this.brandControl.setValue(this.brand);
		}
	}

	openAddEditBrandDialog(){
		const dialogRef = this.dialog.open(AddEditBrandComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if(result){
        this.brands.push(result.brand);
        this.notifier.notify("success", result.msg);
      }
    });
	}

  _filter(value:string, list: Array<any>): Array<any>{
	    if(value && typeof value==="string"){
	      const filterValue = value.toLowerCase();
	        return list.filter(option => (option.sname.toLowerCase()
	        	.includes(filterValue)));  
	    } else if(list){
	      return list;
	    }
	} 

	displayFn(brand?: Brand): string | undefined {
	    return brand ? brand.sname : undefined;
	}

	selected($event){
		this.brand = $event.option.value;
		this.brandSelected.emit(this.brand);
	}
}
