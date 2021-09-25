import { Component, NgZone, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from '../../authentication/authentication.service';
import { OrderService } from '../../shoppin/order/order.service';
import { Payment } from './../payment';
import { PaymentService } from './../payment.service';

declare var Razorpay: any;

@Component({
  selector: "app-razorpay-payment-button",
  templateUrl: "./razorpay-payment-button.component.html",
})
export class RazorpayButtonComponent {
  readonly razorpay: string = "RAZORPAY";
  @Input("paymentDetail") paymentDetail;
  @Output("paymentProcessCompleted") paymentProcessCompleted: EventEmitter<any> = new EventEmitter();
  payment: Payment = new Payment();
  amount: number;
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
    private notifier: NotifierService,
    private authenticationService: AuthenticationService,
    private paymentService: PaymentService,
    private router: Router,
    private dialog: MatDialog,
    private zone: NgZone
  ) {
  }

  ngOnInit() {
  }

  initiateRazorpayForm(result) {
    var usermob = this.authenticationService.getTokenOrOtherStoredData("mobile").toString();
    this.razorPayOptions.key = environment.razorpay.keyId;
    this.razorPayOptions.amount = this.paymentDetail['amount'];
    this.razorPayOptions.prefill.name = this.authenticationService.getTokenOrOtherStoredData("name");
    this.razorPayOptions.prefill.email = this.authenticationService.getTokenOrOtherStoredData("email");
    this.razorPayOptions.prefill.contact = usermob;
    this.razorPayOptions.order_id = this.paymentDetail['razorpay_order_id'];
    this.razorPayOptions.handler = this.razorPayCallbackHandler.bind(this);
    var rzp1 = new Razorpay(this.razorPayOptions);
    rzp1.on('payment.failed', function (response) {
      alert(response.error.reason);
    });
    rzp1.open();
  }

  razorPayCallbackHandler(response) {
    this.paymentService.verifyRazorpayPayment({
      order_id: this.paymentDetail['orderId'],
      payment_id: this.paymentDetail['paymentId'],
      amount: this.paymentDetail['amount'],
      razorpay_payment_id: response.razorpay_payment_id,
      razorpay_order_id: response.razorpay_order_id,
      razorpay_signature: response.razorpay_signature
    }).subscribe((result) => {
      console.log(result);
      this.postSuccessProcess(result);
    });
  }

  postSuccessProcess(result) {
    this.zone.run(() => {
      if (result['success']) {
        this.notifier.notify("success", result['msg']);
        this.paymentProcessCompleted.emit(true);
      } else {
        this.notifier.notify("error", result['msg']);
      }
    });
  }
}
