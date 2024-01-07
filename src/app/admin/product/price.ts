
import {SaleDetail} from './sale-detail';

export class Price{
	id:string;
	location: JSON;
	maxAlldQty: number;
	qty: number;
	sku: string;
	unitPrice: number;
	discounts: Array<SaleDetail>;
  isPriceSame: boolean;
  costPrice: number;
  
  constructor(){
    this.isPriceSame = false;
  }

  static fromJson(jsonPrices){
    var result: Array<Price> = [];
    for(var data of jsonPrices){
      var price = new Price();
      if(data['id']){
        price.id = data['id'];
      }else if(data['_id']){
        price.id = data['_id'];
      }
      
      price.location = data['location'];
      price.maxAlldQty = data['maxAlldQty'];
      price.qty = data['qty'];
      price.sku = data['sku'];
      price.unitPrice = data['unitPrice'];
      price.discounts = data['discounts'];
      price.isPriceSame = data['isPriceSame'];
      result.push(price);
    }

    return result
  }
}


/*{
  price_detail:{
    price:1200,
    sale:{salePrice:1000, saleEndDate:"2050-12-31 23:59:59"}
  },
  variants:[
    {
      sku: "465453543543534"
      price_detail:{
        price:1100,
        sale:{salePrice:950, saleEndDate:"2050-12-31 23:59:59"}
      }
    }
  ]
}*/