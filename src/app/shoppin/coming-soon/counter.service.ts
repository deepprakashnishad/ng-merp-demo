import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class Counter {
  now;
  eventDate;
  currentTiime;
  eventTime;
  remTime;
  s;
  m;
  h;
  d;


  countdown(eventDateTime) {

    this.now = new Date();
    this.eventDate = new Date(eventDateTime);
    this.currentTiime = this.now.getTime();
    this.eventTime = this.eventDate.getTime();
 

    this.remTime = this.eventTime - this.currentTiime;

    this.s = Math.floor(this.remTime / 1000);
    this.m = Math.floor(this.s / 60);
    this.h = Math.floor(this.m / 60);
    this.d = Math.floor(this.h / 24);

    this.h %= 24;
    this.m %= 60;
    this.s %= 60;




    setTimeout(() => {
      this.countdown(eventDateTime)
    }, 1000);

  }
}
