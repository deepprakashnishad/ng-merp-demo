import { Component, NgZone, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { CheckoutService } from 'paytm-blink-checkout-angular';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from '../authentication/authentication.service';
import { CartService } from '../shoppin/cart/cart.service';
import { OrderConfirmationComponent } from '../shoppin/order/order-confirmation/order-confirmation.component';
import { OrderService } from '../shoppin/order/order.service';
import { Payment } from './payment';
import { PaymentService } from './payment.service';

declare var Razorpay: any;

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {

  readonly razorpay: string = "RAZORPAY";
  readonly paytm: string = "PAYTM";

  modeOfPayment: string = "online";
  orderId: string;
  payment: Payment = new Payment();
  instancePaymentComponent: PaymentComponent;
  amount: number;

  private subs: Subscription;

  storeSettings = JSON.parse(sessionStorage.getItem("storeSettings"));

  razorPayOptions = {
    "key": "", // Enter the Key ID generated from the Dashboard
    "amount": "50000", // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
    "currency": "INR",
    "name": environment.appName,
    "description": "Healthy & pure products from everything satvik",
    "image": this.storeSettings?.logo?.downloadUrl, //environment.logoUrl,
    "order_id": "", //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
    "handler": this.razorPayCallbackHandler.bind(this),
    "prefill": {
        "name": "",
        "email": "",
        "contact": ""
    },
    "notes": {
        "address": ""
    },
    "theme": {
      "color": "#731539"
    }
  }

  constructor(
    private orderService: OrderService,
    private cartService: CartService,
    private notifier: NotifierService,
    private authenticationService: AuthenticationService,
    private paymentService: PaymentService,
    private router: Router,
    private dialog: MatDialog,
    private zone: NgZone,
    private checkoutService: CheckoutService
  ) { 
  }

  ngOnInit() {
  }

  placeOrder(paymentGateway) {
    if(this.orderId){
      this.notifier.notify("success", "Order is created. Please check in my orders");
      this.postSuccessProcess({ success: true, msg: "Order is already placed" });
      // this.paymentService.retryPayment({
      //   order_id: this.orderId,
      //   payment_id: this.payment.id,
      // }).subscribe(result=>{
      //   this.postSuccessProcess();
      // });
    }else{
      this.orderService.add({
        "modeOfPayment": this.modeOfPayment,
        "paymentGateway": paymentGateway,
        "fulfillmentType": sessionStorage.getItem("fulfillmentType"),
        "fulfillmentAddress": JSON.parse(sessionStorage.getItem("selectedAddress"))
      }).subscribe(result=>{
        if (result['success']) {
          // this.cartService.deleteLocalCart();
          if (result['payment_details']) {
            this.payment = Payment.fromJSON(result['payment_details']);
          }
          //COD
          if (this.modeOfPayment === "cod") {
            this.orderId = result['id'];
            this.postSuccessProcess({success: true, msg: "Your order has been placed successfully"});
          } else {
            this.orderId = result['order']['id'];
            //Razorpay
            if (paymentGateway === this.razorpay) {
              this.amount = result['amount'];
              this.initiateRazorpayForm(result);
            }

            //Paytm
            else if (paymentGateway === this.paytm) {
              console.log(result);
              this.checkoutService.init(
                //config
                {
                  data: {
                    orderId: result['order']['id'],
                    amount: result['order']['netPrice'],
                    token: result['body']['txnToken'],
                    tokenType: "TXN_TOKEN"
                  },
                  merchant: {
                    mid: environment.paytm.merchantId,
                    name: environment.paytm.merchantName,
                    redirect: true
                  },
                  flow: "DEFAULT",
                  handler: {
                    notifyMerchant: this.notifyPaytmHandler
                  }
                },
                //options
                {
                  env: 'STAGE', // optional, possible values : STAGE, PROD; default : PROD
                  openInPopup: true // optional; default : true
                }
              );

              this.subs = this.checkoutService
                .checkoutJsInstance$
                .subscribe(instance => console.log(instance));
            }
          }
        } else {
          this.notifier.notify("error", "Failed to create order");
        }
      })
    }
  }

  notifyPaytmHandler = (eventType, data): void => {
    console.log('MERCHANT NOTIFY LOG', eventType, data);
  }

  ngOnDestroy(): void {
    if (this.subs) {
      this.subs.unsubscribe();
    }
  }

  initiateRazorpayForm(result) {
    var usermob = this.authenticationService.getTokenOrOtherStoredData("mobile").toString();
    this.orderId = result['receipt'];
    this.razorPayOptions.key = environment.razorpay.keyId;
    this.razorPayOptions.amount = result['amount'];
    this.razorPayOptions.prefill.name = this.authenticationService.getTokenOrOtherStoredData("name");
    this.razorPayOptions.prefill.email = this.authenticationService.getTokenOrOtherStoredData("email");
    this.razorPayOptions.prefill.contact = usermob;
    this.razorPayOptions.order_id = result['id'];
    this.razorPayOptions.handler = this.razorPayCallbackHandler.bind(this);
    var rzp1 = new Razorpay(this.razorPayOptions);
    rzp1.on('payment.failed', function(response){
      alert(response.error.reason);
    });
    rzp1.open();
  }

  razorPayCallbackHandler(response){
    this.paymentService.verifyRazorpayPayment({
      order_id: this.orderId,
      payment_id: this.payment.id,
      amount: this.amount,
      razorpay_payment_id: response.razorpay_payment_id,
      razorpay_order_id: response.razorpay_order_id,
      razorpay_signature: response.razorpay_signature
    }).subscribe((result)=>{
      console.log(result);
      this.postSuccessProcess(result);
    });
  }

  postSuccessProcess(result){
    this.zone.run(() => {
      if (result['success']) {
        this.notifier.notify("success", result['msg']);
        this.notifier.notify("success", "Track your order from My Orders")
        this.cartService.deleteLocalCart();
        this.openConfirmationDialog();
        this.router.navigate(['/order-list']);
      } else {
        this.notifier.notify("error", result['msg']);
      }     
    });
  }

  openConfirmationDialog() {
    this.dialog.open(OrderConfirmationComponent, {
      data: this.orderId,
    });
  }
}
