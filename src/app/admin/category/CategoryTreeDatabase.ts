import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of as observableOf } from 'rxjs';
import { map, startWith, switchMap } from 'rxjs/operators';

import { CategoryTreeNode } from './CategoryTreeNode';
import { CategoryFlatNode } from './CategoryFlatNode';

@Injectable()
export class CategoryTreeDatabase {
  dataChange = new BehaviorSubject<CategoryTreeNode[]>([]);

  get data(): CategoryTreeNode[] { return this.dataChange.value; }

  constructor() {
  }

  setInitialCategory(category: any){
    this.dataChange.next(category);
  }

  /** Add an item to to-do list */
  insertItem(parent: CategoryTreeNode, category: CategoryTreeNode) {
    if (parent !== null && parent !== undefined && parent.childrens) {
      parent.childrens.push(category);
    }else{
      this.dataChange.value.push(category);
    }
    this.dataChange.next(this.data);
  }

  updateItem(node: CategoryTreeNode, modifiedNode: CategoryTreeNode) {
    this.dataChange.next(this.data);
  }

  deleteItem(parent:CategoryTreeNode, node: CategoryTreeNode){
    if(parent != null){
      const index = this.findChildIndex(parent, node);
      parent.childrens.splice(index, 1);
    }else{
      const index = this.findNodeIndex(node);
      this.dataChange.value.splice(index, 1);
    }
    this.dataChange.next(this.data);
  }

  findChildIndex(parent: CategoryTreeNode, child: CategoryTreeNode){
    for(let i=0;i<parent.childrens.length;i++){
      if(parent.childrens[i].id === child.id){
        return i;
      }
    }
    return -1;
  }

  findNodeIndex(node: CategoryTreeNode){
    for(let i=0;i<this.dataChange.value.length;i++){
      if(node.id === this.dataChange.value[i].id){
        return i;
      }
    }
  }

  findNodeWithId(nodeId: string){
    var resultNode=null;
    for(let i=0;i<this.dataChange.value.length;i++){
      if(nodeId === this.dataChange.value[i].id){
        return this.dataChange.value[i];
      }
      resultNode = this.digChildrenForMatch(nodeId, this.dataChange.value[i]);
      if(resultNode !== null && resultNode !== undefined){
        return resultNode;
      }
    }
    return resultNode;        
  }

  digChildrenForMatch(nodeId: string, searchNode: CategoryTreeNode){
    if(nodeId === searchNode.id){
      return searchNode;
    }
    for(let i=0;i<searchNode.childrens.length;i++){
      return this.digChildrenForMatch(nodeId, searchNode.childrens[i]);
    }
  }

  findTargetSiblingForSwap(node: CategoryTreeNode, direction: string){    
    /*const parentsNode = this.findParentNode(node);
    if(parentsNode === null && direction==="up"){
      return this.dataChange.value[this.dataChange.value.indexOf(node)-1];
    }else if(parentsNode !== null && direction==="up"){
      return parentsNode.children[parentsNode.childrens.indexOf(node)-1];
    }else if(node.parents === null && direction==="down"){
      return this.dataChange.value[this.dataChange.value.indexOf(node)+1];
    }else if(parentsNode !== null && direction==="down"){
      return parentsNode.childrens[parentsNode.childrens.indexOf(node)+1];
    }*/
  }
}
