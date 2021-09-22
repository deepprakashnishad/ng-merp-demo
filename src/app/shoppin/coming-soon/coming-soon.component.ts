import { Component, OnInit } from "@angular/core";
import { SharedAnimations } from './shared-animations';
import { Counter } from './counter.service';

@Component({
  selector: "app-coming-soon",
  templateUrl: "./coming-soon.component.html",
  styleUrls: ["./coming-soon.component.scss"],
  animations: [SharedAnimations]
})
export class ComingSoonComponent implements OnInit {

  eventDate = "aug 13, 2021 00:00:01"
  message: string;
  result: string;
  constructor(
    public timerCounter: Counter,
  ) { }

  ngOnInit() {
    this.timerCounter.countdown(this.eventDate);
  }
}
