import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatSnackBar} from '@angular/material/snack-bar';
import { map, startWith, switchMap, filter } from 'rxjs/operators';
import { BehaviorSubject, Observable, of as observableOf } from 'rxjs';
import {CategoryService } from './../category.service';
import {Category} from './../category';
import {CategoryTreeDatabase} from './../CategoryTreeDatabase';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-category-tree-node',
  templateUrl: './category-tree-node.component.html',
  styleUrls: ['./category-tree-node.component.scss']
})
export class CategoryTreeNodeComponent implements OnInit {

	categories: Array<Category>;
	category: Category;
	parentId: string=null;
	title: string;
	categoryFilteredList: Observable<any[]>;
	errors: Array<string>=[];
	categoryCntl=new FormControl();

	// selectedNodeChildrens: Array<string> = [];

  constructor(
  	private fb: FormBuilder,
	private snackBar: MatSnackBar,
	public dialogRef: MatDialogRef<CategoryTreeNodeComponent>,
    private database: CategoryTreeDatabase,
    private categoryService: CategoryService,
	private notifier: NotifierService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { 
    if(data.node!==null && data.node!==undefined && data.mode === 'add'){
      this.parentId = data.node.id;
	  this.title = `Add sub-category to ${data.node.title}`;
	//   this.selectedNodeChildrens = data.node.childrens.map(ele=>ele.id);
	//   console.log(this.selectedNodeChildrens);
    }else if(data.mode === 'edit'){
      this.category = data.node.category;
    }else if((data.node===null || data.node===undefined) && data.mode === 'add'){
    	this.parentId = null;
		this.title = `Add new department`;
    }
    this.categories = data.categories;
  }

  ngOnInit() {
  	if(this.data.mode=="edit"){
  		console.log(this.data.node.category);
  	  this.category = this.data.node.category;
  	}else{
  		this.category = new Category();
  	}

  	this.categoryFilteredList = this.categoryCntl.valueChanges.pipe(
    startWith(''),
    map((filterStr: string | null) => {
      return this._filter(filterStr, this.categories)
    }));
  }

  	_filter(value:string, list: Array<any>): Array<any>{
	    if(value && typeof value==="string"){
	      const filterValue = value.toLowerCase();
	        return list.filter(option => (option.title.toLowerCase()
	        	.includes(filterValue.toLowerCase())));  
	    } else if(list){
	      return list;
	    }
	} 

	displayFn(category?: Category): string | undefined {
	    return category ? category.title : undefined;
	}

	selected($event){
		this.category = $event.option.value;
	}

	save(){
		if(this.data.mode === "add"){
			this.categoryService.addCategoryNode(this.category, this.data.node)
		  	.subscribe((response)=>{
		  		this.dialogRef.close({success:true, mode: this.data.mode, node: response.node, parent: response.parent, msg: `${response.node.title} category added to tree successfully`});
		  	}, (err)=>{
		  		this.notifier.notify("error", err);
		  	});
		}else{
			var updatedNode = this.data.node;
			updatedNode.category = this.category;
			updatedNode.title = this.category.title;
			updatedNode.ancestors = this.data.node.ancestors
									.replace(this.data.node.id, this.category.id);
		}
	}
}
