import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
@Injectable(
  {
    providedIn: 'root'
  }
)
export class PwaService {

  promptEvent: any;

  constructor(
    private swUpdate: SwUpdate
  ) {
    this.updateClient();

    window.addEventListener('beforeinstallprompt', event => {
      this.promptEvent = event;
    });
  }

  updateClient() {
    if (!this.swUpdate.isEnabled) {
      console.log("Service update not available");
      return;
    }

    this.swUpdate.available.subscribe(event => {
      console.log('current: ', event.current, "available: ", event.available);
      if (confirm("Update available for the app. Would you like to update?")) {
        this.swUpdate.activateUpdate().then(() => location.reload());
      }
    });

    this.swUpdate.activated.subscribe(event => {
      console.log("current: ", event.previous, 'available: ', event.current);
    });
  }
}
