import { Component } from "@angular/core";
import { NotifierService } from "angular-notifier";
import { DeliveryService } from "../../../admin/delivery-config/delivery.service";

@Component({
  selector: 'app-pincode-checker',
  templateUrl: './pincode-checker.component.html',
  styleUrls: ['./pincode-checker.component.scss']
})
export class PincodeCheckerComponent {

  pincode: string;

  constructor(
    private deliveryService: DeliveryService,
    private notifier: NotifierService
  ) {

  }

  checkPincode() {
    this.deliveryService.checkPincodeAvailability(this.pincode).subscribe(result => {
      if (result.length>0) {
        this.notifier.notify("success", `Delivery is available ${this.pincode}`);
      } else {
        this.notifier.notify("error", `We regret unavailability of service to your place`);
      }
    });
  }
}
