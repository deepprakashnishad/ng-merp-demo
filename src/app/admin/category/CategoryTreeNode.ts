import {Category} from './category';
export class CategoryTreeNode {
	id: string;
  	title: string;
  	category: Category;
  	parent: CategoryTreeNode;
  	childrens: Array<CategoryTreeNode>;
  	ancestors: string;
}