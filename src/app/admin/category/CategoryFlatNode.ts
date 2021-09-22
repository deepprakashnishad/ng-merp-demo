/** Flat to-do item node with expandable and level information */
export class CategoryFlatNode {
	id: string;
  	title: string;
  	level: number;
  	childrenCount: number;
  	expandable: boolean;
  	ancestors: string;
}