import { Component, OnInit, Input,ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { FlatTreeControl} from '@angular/cdk/tree';
import { MatDialog} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { CategoryTreeNodeComponent } from './..//category-tree-node/category-tree-node.component';
import { CategoryService } from './../category.service';
import { DialogService } from './../../../shared/confirm-dialog/dialog.service';
import { CategoryTreeDatabase } from './../CategoryTreeDatabase';
import {CategoryFlatNode} from './../CategoryFlatNode';
import { Category } from './../category';
import { CategoryTreeNode} from './../CategoryTreeNode';
import { Router } from '@angular/router';


@Component({
  selector: 'app-category-tree',
  templateUrl: './category-tree.component.html',
  styleUrls: ['./category-tree.component.scss']
})
export class CategoryTreeComponent implements OnInit {

  @Input() categories: Array<Category>;

  @Input() allowEdit: boolean = true;

  @Input() isExpanded: boolean = true;

  @Input() treeNodePadding: number = 10;

  @Input() showExpansionIcon: boolean = true;

  @Input() enableNavigation: boolean = false;

  @Output() categorySelected: EventEmitter<CategoryTreeNode> = new EventEmitter();

	categoryTreeNode: CategoryTreeNode;

	categoryTree: Array<CategoryTreeNode>;

	flatNodeMap = new Map<string, CategoryTreeNode>();
	/** Map from nested node to flattened noChangeDetectorRefde. This helps us to keep the same object for selection */

	nestedNodeMap = new Map<string, CategoryFlatNode>();
	  
	/** A selected parent node to be inserted */
	categoryNodeMap = new Map<string, CategoryTreeNode>();

	selectedParent: CategoryFlatNode | null = null;
	treeControl: FlatTreeControl<CategoryFlatNode>
	treeFlattener: MatTreeFlattener<CategoryTreeNode, CategoryFlatNode>
	dataSource: MatTreeFlatDataSource<CategoryTreeNode, CategoryFlatNode>

  constructor(
  	private database: CategoryTreeDatabase,
    private changeDetectorRefs: ChangeDetectorRef,
    private categoryService: CategoryService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private dialogService: DialogService,
    private router: Router
   ) { 
  	this.treeFlattener = new MatTreeFlattener(
  		this.transformer, this.getLevel,this.isExpandable, this.getChildren);
    this.treeControl = new FlatTreeControl<CategoryFlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

    this.database.dataChange.subscribe(data => this.dataSource.data = data);
  }

  ngOnInit() {
  	this.categoryService.fetchCategoryTree()
    .subscribe((categoryTreeNodes)=>{
      this.database.setInitialCategory(categoryTreeNodes);
      if (this.isExpanded) {
        this.treeControl.expandAll();
      }      
    });
  }

  refreshTreeView(){
  	const _data = this.dataSource.data;
    this.dataSource.data = [];
    this.dataSource.data = _data;
  }

  openAddEditCategoryDialog(selectedTreeNode: CategoryFlatNode, mode: string){
    var selectedNode;
    if(selectedTreeNode){
      selectedNode = this.flatNodeMap.get(selectedTreeNode.id);
    }else{
      selectedNode = null;
    }
    const dialogRef = this.dialog.open(CategoryTreeNodeComponent,{
      height: '400px',
      width: '900px',
      data:{
      	node: selectedNode,
      	mode: mode,
      	categories: this.categories
      }
    });


    dialogRef.afterClosed().subscribe((result) => {
      if(result){
      	if(result.mode === "add"){
      		this.addNewItem(result.parent, result.node);
      	}else{
      		this.updateItem(result.parent, result.node);
      	}
        this.snackBar.open(
          result.msg, "Dismiss", {
          duration: 5000
        });
      }
    });
  }

  addNewItem(node: CategoryFlatNode, childCategoryNode: CategoryTreeNode) {
    if(node !== null){
      node.childrenCount++;
      const parentNode = this.flatNodeMap.get(node.id);  
      this.database.insertItem(parentNode, childCategoryNode);
    }else{
      this.database.insertItem(null, childCategoryNode);
    }
    this.refreshTreeView();
    this.treeControl.expand(node);
  }

  updateItem(oldCategoryNode: CategoryFlatNode, updatedCategoryNode: CategoryTreeNode){
  	
  }

  deleteCategoryNode(flatNode: CategoryFlatNode){
    this.dialogService
      .confirm(`Delete node ${flatNode.title}`, `Are you sure to delete ${flatNode.title} entry?`)
      .subscribe(res => {
          if(res){
          	this.categoryService.deleteCategoryNode(flatNode.id)
		    .subscribe((categoryTreeNode)=>{
          if(categoryTreeNode.parent == null){
            this.database.deleteItem(null, categoryTreeNode);  
          }else{
            var parentId;
            if(typeof categoryTreeNode.parent == "string"){
              parentId = categoryTreeNode.parent;
            }else{
              parentId = categoryTreeNode.parent.id;
            }
            let parent = this.flatNodeMap.get(parentId);
            this.database.deleteItem(parent, categoryTreeNode);  
          }
		    	
		    	this.refreshTreeView();
		    });
          }
    });
  }

  transformer = (node: CategoryTreeNode, level: number) => {
    const existingNode = this.nestedNodeMap.get(node.id);
    const flatNode = existingNode && existingNode.id === node.id
        ? existingNode
        : new CategoryFlatNode();
    flatNode.title = '';
    flatNode.id = node.id;
    
    flatNode.level = level;
    flatNode.title = node.title;
    flatNode.childrenCount = node.childrens.length;

    this.flatNodeMap.set(flatNode.id, node);
    this.nestedNodeMap.set(node.id, flatNode);
    this.categoryNodeMap.set(node.id, node);
    return flatNode;
  }

  getLevel = (node: CategoryFlatNode) => node.level;

  isExpandable = (node: CategoryFlatNode) => {return node.childrenCount > 0};

  getChildren = (node: CategoryTreeNode): CategoryTreeNode[] => node.childrens;

  hasChild = (_: number, node: CategoryFlatNode) => {return node.childrenCount > 0};

  hasNoContent = (_: number, _nodeData: CategoryFlatNode) => _nodeData.title === '';

  navigate(flatNode: CategoryFlatNode) {
    var categoryTreeNode = this.flatNodeMap.get(flatNode.id);
    if (this.enableNavigation) {
      this.router.navigate(['/product-by-category'], { queryParams: {id: categoryTreeNode.category } });
    }
    this.categorySelected.emit(categoryTreeNode);
  }
}
