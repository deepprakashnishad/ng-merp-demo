import { Rating } from 'src/app/shoppin/rating/rating';
import {Brand} from './../brand/brand';
import { SaleDetail } from './sale-detail';
import {Variant} from './variant'

export class Product{
    id: string;
    name:string;
    lname: string;
    taxonomies: Array<string>;
    brand: Brand;
    assets: {imgs:Array<any>};
    maxAlwdQty: number;
    qty: number;
    shipping: {};
    specs:{};
    attrs: {};
    sattrs: {};
    variants: {cnt:number, attrs:{name: string, value: string}[]};
    desc: {shortDesc: [{lang:string, val:string}], longDesc:[{lang:string, val:string}]};
    variations: Array<Variant>;
    status: string;
    tax: number;
    discount: Array<SaleDetail>;
    sellPrice: number;
    costPrice: number;
  ratings: Array<Rating>;
  sortIndex: number;

    constructor(){
        this.desc = {shortDesc: [{lang:"en", val:""}], longDesc:[{lang:"en", val:""}]};
      this.assets = { imgs: [] };
      this.sortIndex = 999;
    }
}
