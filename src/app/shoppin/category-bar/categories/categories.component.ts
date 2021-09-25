import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Category } from "../../../admin/category/category";
import { CategoryService } from "../../../admin/category/category.service";
import { CategoryTreeNode } from "../../../admin/category/CategoryTreeNode";

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
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.nodes = JSON.parse(sessionStorage.getItem("catTree"));
    if (!this.nodes) {
      this.categoryService.fetchCategoryTree(true).subscribe(result => {
        this.nodes = result;
        sessionStorage.setItem("catTree", JSON.stringify(this.nodes));
        
      });
    } else {
      this.nodes.forEach(ele => {
        this.displayedNodes.push(ele);
      })
    }
  }

  updateDisplayedCategories(categories) {
    this.displayedNodes = categories;
  }

  navigateToSubCat(node: CategoryTreeNode) {
    if (node.childrens.length === 0) {
      this.router.navigate(['/product-by-category'], { queryParams: node.category });
    } else {
      this.nodeNavigation.push(this.displayedNodes);
      this.displayedNodes = node.childrens;
    }
  }

  backNavigation() {
    this.displayedNodes = this.nodeNavigation.pop();
  }
}
