import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { share } from 'rxjs/operators';

@Injectable(
  { providedIn: 'root'}
)
export class StorageService implements OnDestroy {
  private onSubject = new Subject<{ key: string, value: any }>();
  public changes = this.onSubject.asObservable().pipe(share());

  constructor() {
    this.start();
  }

  ngOnDestroy() {
    this.stop();
  }

  public getValueFromStoreSettings(key: string) {
    var storeSettings = JSON.parse(sessionStorage.getItem("storeSettings"));
    if (key) {
      return storeSettings[key];
    } else {
      return storeSettings;
    }
  }

  public getStorage() {
    let s = [];
    for (let i = 0; i < localStorage.length; i++) {
      s.push({
        key: localStorage.key(i),
        value: JSON.parse(localStorage.getItem(localStorage.key(i)))
      });
    }
    return s;
  }

  public store(key: string, data: any, type: string = "session"): void {
    if (type = "session") {
      sessionStorage.setItem(key, JSON.stringify(data));
    } else {
      localStorage.setItem(key, JSON.stringify(data));
    }
    this.onSubject.next({ key: key, value: JSON.stringify(data)})
  }

  public clear(key) {
    localStorage.removeItem(key);
    this.onSubject.next({ key: key, value: null });
  }


  private start(): void {
    window.addEventListener("storage", this.storageEventListener.bind(this));
  }

  private storageEventListener(event: StorageEvent) {
    if (event.storageArea == localStorage) {
      let v;
      try { v = JSON.parse(event.newValue); }
      catch (e) { v = event.newValue; }
      this.onSubject.next({ key: event.key, value: v });
    }
  }

  private stop(): void {
    window.removeEventListener("storage", this.storageEventListener.bind(this));
    this.onSubject.complete();
  }
}
