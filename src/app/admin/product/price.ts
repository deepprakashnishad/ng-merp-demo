
import {SaleDetail} from './sale-detail';

export class Price{
	id:string;
	product: string;
	primaryStockDetails: {
		id: string, //concatenation of storeId, product id
		store: string,
		location: {long: number, lat: number},
		stock: number,
		priceDetail:{
			costPrice:number,
			price: number,
			currency: string,
			saleList: SaleDetail[]
		}
	};
	altStockDetails:[
		{
			id: string, //concatenation of storeId, productId
			store: string,
			location: {long: number, lat: number},
			stock: number,
			priceDetail:{
				costPrice:number,
				price: number,
				currency: string,
				saleList: SaleDetail[]			
			},
		}
	];
	variantStockDetails:[
		{
			id: string, //concatenation of variant id and store id
			store: string,
			variantId: string,
			location: {long: number, lat: number},
			stock: number,
			priceDetail:{
				costPrice: number,
				price: number,
				currency: string,
				saleList: SaleDetail[]
			},
		}
	];
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