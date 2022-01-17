import { Price } from "src/app/admin/product/price";
import { Product } from "src/app/admin/product/product";

export class CartItem{
    id: string;
    product: any;
    selectedPrice: Price;
    qty: number;

    static fromJSON(data){
        var cart:Array<CartItem> = [];
        if(data!=null){
            for(var i=0;i<data.length;i++){
                var item = new CartItem();
                item.id = data[i]['id'];
                item.product = data[i]['product'];
                item.qty = data[i]['qty'];
                if(data[i]['si']){
                    item.selectedPrice = data[i]['si'];
                }
                if(data[i]['selectedPrice']){
                    item.selectedPrice = data[i]['selectedPrice'];
                }
                cart.push(item);
            }
        }
        return cart;   
    }
}