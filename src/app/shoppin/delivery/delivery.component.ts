import { trigger, transition, style, animate } from '@angular/animations';
import { AfterContentInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Address } from 'src/app/shared/address/address';

@Component({
  selector: 'app-delivery',
  templateUrl: './delivery.component.html',
  styleUrls: ['./delivery.component.scss'],
  animations: [
    trigger(
      'inOutAnimation', 
      [
        transition(
          ':enter', 
          [
            style({opacity: 0 }),
            animate('500ms ease-out', 
                    style({opacity: 1 }))
          ]
        ),
        transition(
          ':leave', 
          [
            style({ opacity: 1 }),
            animate('500ms ease-in', 
                    style({ opacity: 0 }))
          ]
        )
      ]
    )
  ]
})
export class DeliveryComponent implements OnInit, AfterContentInit {

  selectedAddress: Address;
  fulfillmentType: string = "delivery";

  constructor(
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.selectedAddress = JSON.parse(sessionStorage.getItem("selectedAddress"));
    sessionStorage.setItem("fulfillmentType", this.fulfillmentType);
  }

  ngAfterContentInit(){ 
    this.cd.detectChanges();
  }

  addressSelected(event){
    this.selectedAddress = event;
  }

  fulfillmentTypeUpdated(event){
    sessionStorage.setItem("fulfillmentType", event.value);
    sessionStorage.removeItem("selectedAddress");
    this.selectedAddress = undefined;
  }

}
