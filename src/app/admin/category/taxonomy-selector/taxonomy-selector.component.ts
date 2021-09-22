import { Component, OnInit, Input,ChangeDetectorRef, SimpleChanges } from '@angular/core';
import { FlatTreeControl} from '@angular/cdk/tree';
import {SelectionModel} from '@angular/cdk/collections';
import { MatDialog} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { CategoryService } from './../category.service';
import { DialogService } from './../../../shared/confirm-dialog/dialog.service';
import { CategoryTreeDatabase } from './../CategoryTreeDatabase';
import {CategoryFlatNode} from './../CategoryFlatNode';
import { Category } from './../category';
import { CategoryTreeNode} from './../CategoryTreeNode';


@Component({
  selector: 'app-taxonomy-selector',
  templateUrl: './taxonomy-selector.component.html',
  styleUrls: ['./taxonomy-selector.component.scss']
})
export class TaxonomySelectorComponent implements OnInit {

	@Input()
	categories: Array<Category>;

  @Input() selectedTaxonomies: Array<String>;

	categoryTreeNode: CategoryTreeNode;

	categoryTree: Array<CategoryTreeNode>;

	flatNodeMap = new Map<string, CategoryTreeNode>();
	/** Map from nested node to flattened noChangeDetectorRefde. This helps us to keep the same object for selection */

	nestedNodeMap = new Map<string, CategoryFlatNode>();
	  
	/** A selected parent node to be inserted */
	categoryNodeMap = new Map<string, CategoryTreeNode>();

	checklistSelection = new SelectionModel<CategoryFlatNode>(true /* multiple */);

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
      this.treeControl.expandAll();
    });
  }

  toggleSelection(): void {
    if(this.selectedTaxonomies){
      for (let i = 0; i < this.treeControl.dataNodes.length; i++) {
        this.selectedTaxonomies.forEach(ele=>{
          if (this.treeControl.dataNodes[i].ancestors == ele) {
            this.selectItem(this.treeControl.dataNodes[i]);
          }
        });
      }    
    }
  }

  selectItem(node: CategoryFlatNode): void{
    this.checklistSelection.select(node);
    const descendants = this.treeControl.getDescendants(node);
    
    this.checklistSelection.select(...descendants);

    // Force update for the parent
    descendants.every(child =>
      this.checklistSelection.isSelected(child)
    );
    this.checkAllParentsSelection(node);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['selectedTaxonomies']){
      this.toggleSelection();
    }
  }

  /** Whether all the descendants of the node are selected. */
  descendantsAllSelected(node: CategoryFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected = descendants.every(child =>
      this.checklistSelection.isSelected(child)
    );
    return descAllSelected;
  }

  /** Whether part of the descendants are selected */
  descendantsPartiallySelected(node: CategoryFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some(child => this.checklistSelection.isSelected(child));
    return result && !this.descendantsAllSelected(node);
  }

  /** Toggle the to-do item selection. Select/deselect all the descendants node */
  categoryItemSelectionToggle(node: CategoryFlatNode): void {
    this.checklistSelection.toggle(node);
    const descendants = this.treeControl.getDescendants(node);
    this.checklistSelection.isSelected(node)
      ? this.checklistSelection.select(...descendants)
      : this.checklistSelection.deselect(...descendants);

    // Force update for the parent
    descendants.every(child =>
      this.checklistSelection.isSelected(child)
    );
    this.checkAllParentsSelection(node);
  }

  /** Toggle a leaf to-do item selection. Check all the parents to see if they changed */
  categoryLeafItemSelectionToggle(node: CategoryFlatNode): void {
    this.checklistSelection.toggle(node);
    this.checkAllParentsSelection(node);
  }

  /* Checks all the parents when a leaf node is selected/unselected */
  checkAllParentsSelection(node: CategoryFlatNode): void {
    let parent: CategoryFlatNode | null = this.getParentNode(node);
    while (parent) {
      this.checkRootNodeSelection(parent);
      parent = this.getParentNode(parent);
    }
  }

  /** Check root node checked state and change it accordingly */
  checkRootNodeSelection(node: CategoryFlatNode): void {
    const nodeSelected = this.checklistSelection.isSelected(node);
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected = descendants.every(child =>
      this.checklistSelection.isSelected(child)
    );
    if (nodeSelected && !descAllSelected) {
      this.checklistSelection.deselect(node);
    } else if (!nodeSelected && descAllSelected) {
      this.checklistSelection.select(node);
    }
  }

  /** Toggle the to-do item selection. Select/deselect all the descendants node */
  itemSelectionToggle(node: CategoryFlatNode): void {
    this.checklistSelection.toggle(node);
    const descendants = this.treeControl.getDescendants(node);
    this.checklistSelection.isSelected(node)
      ? this.checklistSelection.select(...descendants)
      : this.checklistSelection.deselect(...descendants);

    // Force update for the parent
    descendants.every(child =>
      this.checklistSelection.isSelected(child)
    );
    this.checkAllParentsSelection(node);
  }


  /** Toggle a leaf to-do item selection. Check all the parents to see if they changed */
  leafItemSelectionToggle(node: CategoryFlatNode): void {
    this.checklistSelection.toggle(node);
    this.checkAllParentsSelection(node);
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
    flatNode.ancestors = node.ancestors;
    this.flatNodeMap.set(flatNode.id, node);
    this.nestedNodeMap.set(node.id, flatNode);
    this.categoryNodeMap.set(node.id, node);
    return flatNode;
  }

  getParentNode(node: CategoryFlatNode): CategoryFlatNode | null {
    const currentLevel = this.getLevel(node);

    if (currentLevel < 1) {
      return null;
    }

    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;

    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];

      if (this.getLevel(currentNode) < currentLevel) {
        return currentNode;
      }
    }
    return null;
  }

  getTaxonomy(){
    let taxonomies = this.checklistSelection.selected.map(
      (option)=>option.ancestors);
    return taxonomies.sort();
  }

  getSelectedCategories(){
    return this.checklistSelection.selected;
  }

  getLevel = (node: CategoryFlatNode) => node.level;

  isExpandable = (node: CategoryFlatNode) => {return node.childrenCount > 0};

  getChildren = (node: CategoryTreeNode): CategoryTreeNode[] => node.childrens;

  hasChild = (_: number, node: CategoryFlatNode) => {return node.childrenCount > 0};

  hasNoContent = (_: number, _nodeData: CategoryFlatNode) => _nodeData.title === '';

}
