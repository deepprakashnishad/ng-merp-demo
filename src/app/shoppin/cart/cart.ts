import { Product } from "src/app/admin/product/product";

export class CartItem{
    id: string;
    product: Product;
    qty: number;

    static fromJSON(data){
        var cart:Array<CartItem> = [];
        if(data!=null){
            for(var i=0;i<data.length;i++){
                var item = new CartItem();
                item.id = data[i]['id'];
                item.product = data[i]['product'];
                item.qty = data[i]['qty'];
    
                cart.push(item);
            }
        }

        return cart;
        
    }
}