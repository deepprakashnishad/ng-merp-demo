import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { MyIdbService, STORE_SETTINGS_STORE, TS_STORE } from "src/app/my-idb.service";
import { Category } from "../../../admin/category/category";
import { CategoryService } from "../../../admin/category/category.service";
import { CategoryTreeNode } from "../../../admin/category/CategoryTreeNode";

const catRefreshDays = 30;
const catRefreshTimeInMillis = catRefreshDays*24*60*60*1000;

@Component({
  templateUrl: "./categories.component.html",
  styleUrls: ["./categories.component.scss"]
})
export class CategoriesComponent implements OnInit{

  nodes: Array<CategoryTreeNode> = [];

  displayedNodes: Array<CategoryTreeNode> = [];

  nodeNavigation: Array<Array<CategoryTreeNode>> = [];

  constructor(
    private categoryService: CategoryService,
    private router: Router,
    private dbService: MyIdbService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    // this.nodes = JSON.parse(sessionStorage.getItem("catTree"));
    this.dbService.getValue(STORE_SETTINGS_STORE, "CAT_TREE").then(res=>{
      this.nodes = res;
      this.updateCategoryTree();
      if (!this.nodes) {
        // this.updateCategoryTree(); 
      } else {
        this.displayedNodes.splice(0, this.displayedNodes.length);
        this.nodes.forEach(ele => {
          this.displayedNodes.push(ele);
        })
      }
    });
    this.dbService.getValue(TS_STORE, "CAT_TREE").then(res=>{
      if(res+catRefreshTimeInMillis<Date.now()){
        this.updateCategoryTree();
      }
    })
    /* if (!this.nodes) {
      this.categoryService.fetchCategoryTree(true).subscribe(result => {
        this.nodes = result;
        this.nodes.forEach(ele => {
          this.displayedNodes.push(ele);
        })
        sessionStorage.setItem("catTree", JSON.stringify(this.nodes));
        this.dbService.setValue(STORE_SETTINGS_STORE, {"CAT_TREE": this.nodes});
        this.dbService.setValue(TS_STORE, {"CAT_TREE": Date.now()})
      });
    } else {
      this.nodes.forEach(ele => {
        this.displayedNodes.push(ele);
      })
    } */
  }

  updateCategoryTree(){
    this.categoryService.fetchCategoryTree(true).subscribe(result => {
      this.nodes = result;
      this.displayedNodes.splice(0, this.displayedNodes.length);
      this.nodes.forEach(ele => {
        this.displayedNodes.push(ele);
      })
      sessionStorage.setItem("catTree", JSON.stringify(this.nodes));
      this.dbService.setValue(STORE_SETTINGS_STORE, {"CAT_TREE": this.nodes});
      this.dbService.setValue(TS_STORE, {"CAT_TREE": Date.now()})
    });
  }

  updateDisplayedCategories(categories) {
    this.displayedNodes = categories;
  }

  navigateToSubCat(node: CategoryTreeNode) {
    if (node.childrens.length === 0) {
      this.router.navigate(['/product-by-category'], { queryParams: {ancestors: node.ancestors} });
    } else {
      this.nodeNavigation.push(this.displayedNodes);
      this.displayedNodes = node.childrens;
    }
  }

  backNavigation() {
    this.displayedNodes = this.nodeNavigation.pop();
  }
}
