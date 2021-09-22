import { SafeHtml } from "@angular/platform-browser";
import { Product } from "../../product/product";

export class Section{
    id: string;
    title: string;
    imgs: any;
    text: string;
    type: string;
    backgroundColor: string;
    safeHtmlText: SafeHtml;
    status: string;
    productIds: Array<string>;
    products: Array<Product>;

    constructor(){
        this.title = "";
        this.text = "";
        this.type = "Custom";
        this.backgroundColor = "#ffffff";
        this.productIds = [];
        this.products = [];
        this.status = "Active";
    }
}