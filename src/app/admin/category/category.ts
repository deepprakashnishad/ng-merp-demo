import {Facet} from './../facet/facet';

export class Category{
	id: string;
	title: string;
	count: number;
	// parents: Array<Category>;
	// childrens: Array<Category>;
	// isDepartment: boolean;
	// primaryFacets: Array<Facet>;
	// secondaryFacets: Array<Facet>;
	filterFacets: Array<Facet>;
	status: string;
  imgs: any;
  sortIndex: number;

	constructor(){
    this.imgs = { downloadUrl: "" };
    this.sortIndex = 9999;
	}
}
