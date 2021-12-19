import { Rating } from 'src/app/shoppin/rating/rating';
import {Brand} from './../brand/brand';
import { Price } from './price';
import { SaleDetail } from './sale-detail';
import {Variant} from './variant'

export class Product{
    id: string;
    name:string;
    lname: string;
    taxonomies: Array<string>;
    brand: Brand;
    assets: {imgs:Array<any>};
    /* maxAlwdQty: number;
    qty: number; */
    shipping: {};
    specs:{};
    attrs: {};
    sattrs: {};
    variants: {cnt:number, attrs:{name: string, value: string}[]};
    desc: {shortDesc: [{lang:string, val:string}], longDesc:[{lang:string, val:string}]};
    variations: Array<Variant>;
    status: string;
    tax: number;
    /* discount: Array<SaleDetail>;
    sellPrice: number;
    costPrice: number; */
    ratings: Array<Rating>;
    sortIndex: number;
    prices: Array<Price>;

    constructor(){
      this.desc = {shortDesc: [{lang:"en", val:""}], longDesc:[{lang:"en", val:""}]};
      this.assets = { imgs: [] };
      this.sortIndex = 999;
    }

    static fromJSON(jsonProducts: any){
      var result: Array<Product> = [];
      for(var data of jsonProducts){
        var product = new Product();
        product.name = data['name'];
        if(data['id'] !== null){
          product.id = data['id'];
        }else if(data['_id'] !== null){
          product.id = data['_id'];
        }
        product.assets = data['assets'];
        product.lname = data['lname'];
        product.brand = data['brand'];
        product.taxonomies = data['taxonomies'];
        product.shipping = data['shipping'];
        product.attrs = data['attrs'];
        product.variants = data['variants'];
        product.status = data['status'];
        product.tax = data['tax'];
        product.ratings = data['ratings'];
        product.sortIndex = data['sortIndex'];
        product.prices = Price.fromJson(data['prices']);

        result.push(product);
      }

      return result;
    }
}

export interface IProduct{
  id: string;
  name:string;
  lname: string;
  taxonomies: Array<string>;
  brand: Brand;
  assets: {imgs:Array<any>};
  /* maxAlwdQty: number;
  qty: number; */
  shipping: {};
  specs:{};
  attrs: {};
  sattrs: {};
  variants: {cnt:number, attrs:{name: string, value: string}[]};
  desc: {shortDesc: [{lang:string, val:string}], longDesc:[{lang:string, val:string}]};
  variations: Array<Variant>;
  status: string;
  tax: number;
  /* discount: Array<SaleDetail>;
  sellPrice: number;
  costPrice: number; */
  ratings: Array<Rating>;
  sortIndex: number;
  prices: Array<Price>;
}
