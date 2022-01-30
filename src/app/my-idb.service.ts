import { Injectable } from '@angular/core';
import { openDB } from 'idb';
import { noop } from 'rxjs';

export const ITEM_STORE = "item";
export const PRICE_STORE = "price";
export const STORE_SETTINGS_STORE = "storeSettings";
export const TS_STORE = "ts_store";

@Injectable({
  providedIn: 'root'
})
export class MyIdbService {
  static db: any;
  constructor() { 
    console.log("Upgrading DB");
    this.upgradeDB()
  }

  async upgradeDB(){
    if(MyIdbService.db===undefined){
      MyIdbService.db = await openDB("mydb", 2, {
        upgrade(db){
          db.createObjectStore(ITEM_STORE);
          db.createObjectStore(PRICE_STORE);
          db.createObjectStore(STORE_SETTINGS_STORE);
          db.createObjectStore(TS_STORE);
        }
      });
    }
  }

  async setValue(storeName, data){
    var keys = Object.keys(data);
    if(storeName===undefined || storeName===null || keys===undefined || keys.length===0){
      return;
    }
    if(MyIdbService.db===undefined){
      await this.upgradeDB();
    }
    keys.forEach(key => {
      MyIdbService.db.put(storeName, data[key], key)
      .then(result=>{})
      .catch(err=>{console.log("error", err)});
    });
    if(storeName){

    }
  }

  async getValue(storeName, key){
    if(storeName===undefined || storeName===null || key===undefined){
      return;
    }
    if(MyIdbService.db===undefined){
      await this.upgradeDB();
    }
    var promise = MyIdbService.db.get(storeName, key);
    return promise;
  }

  async getAllKeys(storeName){
    if(storeName===undefined || storeName===null){
      return;
    }
    if(MyIdbService.db===undefined){
      await this.upgradeDB();
    }
    var promise = MyIdbService.db.getAllKeys(storeName);
    return promise;
  }

  async getAll(storeName){
    if(storeName===undefined || storeName===null){
      return;
    }
    if(MyIdbService.db===undefined){
      await this.upgradeDB();
    }
    var promise = MyIdbService.db.getAll(storeName);
    return promise;
  }
}
