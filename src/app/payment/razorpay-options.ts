export class RazorPayOptions{
    key: string;
    amount: number;
    currency: string;
    name: string;
    description: string;
    image: string;
    order_id: string;
    handler: Function;
    prefill: any;
    notes: any;
    theme: any;
    constructor(){
        this.currency = "INR";
        this.handler = (res)=>{
            console.log(res);
        };
    }
}