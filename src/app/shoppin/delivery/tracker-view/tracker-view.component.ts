import { SimpleChanges } from '@angular/core';
import { AfterViewInit, ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { Fulfillment } from '../../order/order';

@Component({
  selector: 'app-tracker-view',
  templateUrl: './tracker-view.component.html',
  styleUrls: ['./tracker-view.component.scss']
})
export class TrackerViewComponent implements OnInit {

  @Input("orderStatus") orderStatus: string = "New";
  @Input("fulfillment") fulfillment: Fulfillment;
  @Input("email") email: string;
  @ViewChild('stepper') public trackerStepper: MatStepper;
  completedStepsCnt: number = 0;

  steps: Array<any> = [
    { status: "New", isCompleted: false },
    { status: "In Progress", isCompleted: false },
    { status: "In Transit", isCompleted: false },
    { status: "Delivered", isCompleted: false }
  ];

  constructor(
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.orderStatus && changes.orderStatus.currentValue) {
      for (var i = 0; i < this.steps.length; i++) {
        var element = this.steps[i];
        this.steps[i]['isCompleted'] = true;
        this.completedStepsCnt++;
        //this.trackerStepper.next();
        if (element.status.toLowerCase() === this.orderStatus.toLowerCase()) {
          //this.cd.detectChanges();
          return;
        }
      }
      //this.steps.every(element => {
      //  if(element!==this.orderStatus){
      //    this.trackerStepper.next();
      //    this.cd.detectChanges();
      //    return true;
      //  }else{
      //    return false;
      //  }
      //});
    }
  }
}
