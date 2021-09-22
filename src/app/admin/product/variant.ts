import {Product} from './../product/product';
export class Variant{
	id: string;
	name: string;
    lname: string;
    altIds: {};
    product: Product;
    assets:{};
    attrs:[];
    status:string;
}