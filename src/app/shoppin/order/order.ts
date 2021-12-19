import { SaleDetail } from "src/app/admin/product/sale-detail";
import { Payment } from "src/app/payment/payment";
import { Address } from "src/app/shared/address/address";
import { Brand } from "../../admin/brand/brand";

export class Order{
    id: string;
    createdAt: Long;
    updatedAt: Long;
    fulfillment: Fulfillment;
    items: Array<OrderItem>;
    netPrice: number;
    netSaving: number;
    deliveryCharge: number;
    amountPaid: number;
    status: string;
    modeOfPayment: string;
    paymentDetails: Array<Payment>;

    static fromJSON(data, fetchDetail = true){
        var order = new Order();
        order.id = data['id'];
        order.createdAt = data['createdAt'];
        order.updatedAt = data['updatedAt'];
        order.netPrice = data['netPrice'];
        order.netSaving = data['netSaving'];
        order.amountPaid = data['amountPaid'];
        order.deliveryCharge = data['deliveryCharge'];
        order.status = data['status'];
        order.modeOfPayment = data['modeOfPayment'];
        if (fetchDetail) {
          order.items = OrderItem.fromJSONArray(data['items']);
          order.fulfillment = Fulfillment.fromJSON(data.fulfillment);
          order.paymentDetails = Payment.fromJSONArray(data['paymentDetails']);
        }
        return order;
    }

  static fromJSONArray(dataList: Array<any>): Array<Order> {
    let orders = [];
    dataList.forEach(data => {
      orders.push(this.fromJSON(data, false));
    })

    return orders;
  }
}

export class Fulfillment{
    address: Address;
    fulfillmentType: string;
    tracking: Tracking;
    status: string;
    estimatedDelivery: Long;

    static fromJSON(data){
        if(data && data != null){
            var fulfillment = new Fulfillment();
            fulfillment.fulfillmentType = data['fulfillmentType'];
            fulfillment.status = data['status'];
            fulfillment.address = Address.fromJSON([data])[0];
            fulfillment.tracking = Tracking.fromJSON(data.tracking);
            return fulfillment;
        }else{
            return null;
        }
    }
}

export class OrderItem{
    id: string;
    product: string;
    variant: string;
    brand: Brand;
    name: string;
    qty: number;
    sellPrice: number;
    discount: Array<SaleDetail>;
    tax: number;
    attrs: any;

    static fromJSONArray(data){
        var items = [];
        data.forEach(ele => {
            var item = new OrderItem();
            item.name = ele['name'];
            item.product = ele['product'];
            item.variant = ele['variant'];
            item.id = ele['id'];
            item.qty = ele['qty'];
            item.tax = ele['tax'];
            item.discount = ele['discount'];
            item.sellPrice = ele['sellPrice'];
            item.brand = ele['brand'];
            if(ele['attrs']){
                item.attrs = ele['attrs'];
            }
            items.push(item);
        });
        return items;
    }
}

export class Tracking{
    id: string;
    company: string;
    trackingNumber: string;
    status: string;
    estTime: string;

    static fromJSON(data){
        if(data===undefined || data===null){
            return null;
        }else{
            var tracking = new Tracking();
            tracking.id = data['id'];
            tracking.company = data['company'];
            tracking.estTime = data['estTime'];
            tracking.status = data['status'];
            tracking.trackingNumber = data['trackingNumber'];
            return tracking;
        }
    }
}
