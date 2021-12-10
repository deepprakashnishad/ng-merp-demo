import {Product} from './../product/product';
export class Variant{
	id: string;
	name: string;
    product: string;
    assets: {imgs:Array<any>};
    attrs:{};
    status: boolean;
    
    constructor(){
        this.assets = {imgs:[]};
        this.attrs = {};
        this.status = true;
    }

    static newVariantFromProduct(product: Product){
        var variant: Variant = new Variant();
        variant.name = product.name;
        variant.product = product.id;
        variant.assets = {imgs:[]};
        variant.attrs = {};
        variant.status = true;

        return variant;
    }

    static sanitizeVariant(variant: Variant){
        if(variant.assets===null){
            variant.assets = {imgs:[]};
        }

        if(variant.attrs === null){
            variant.attrs = {};
        }

        if(variant.status===null){
            variant.status = true;
        }

        return variant;
    }
}