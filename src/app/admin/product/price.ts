
import {SaleDetail} from './sale-detail';

export class Price{
	id:string;
	location: JSON;
	maxAlldQty: number;
	qty: number;
	sku: string;
	unitPrice: number;
	discounts: Array<SaleDetail>	
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