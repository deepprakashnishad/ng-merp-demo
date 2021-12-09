export class SaleDetail{
	title: string;
	salePrice: number; 
	saleStartDate: string; 
	saleEndDate: string; 
	discount: number;
	discountPercentage: number;
	minQty: number;
	status: boolean;

	constructor(){
		this.status = true;
		this.minQty = 1;
		this.salePrice = 0.0;
		this.discount = 0.0;
		this.discountPercentage=0.0;
	}
}
