import { Injectable } from '@angular/core';
import { openDB } from 'idb';

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
    this.upgradeDB()
  }

  async upgradeDB(){
    MyIdbService.db = await openDB("mydb", 2, {
      upgrade(db){
        db.createObjectStore(ITEM_STORE);
        db.createObjectStore(PRICE_STORE);
        db.createObjectStore(STORE_SETTINGS_STORE);
        db.createObjectStore(TS_STORE);
      }
    });
  }

  async setValue(storeName, data){
    var keys = Object.keys(data);
    if(storeName===undefined || storeName===null || keys===undefined || keys.length===0){
      return;
    }
    keys.forEach(key => {
      MyIdbService.db.put(storeName, data[key], key)
      .then(result=>console.log("success", result))
      .catch(err=>{console.log("error", err)});
    });
    if(storeName){

    }
  }

  async getValue(storeName, key){
    if(storeName===undefined || storeName===null || key===undefined){
      return;
    }
    var promise = MyIdbService.db.get(storeName, key);
    return promise;
  }

  async getAllKeys(storeName){
    if(storeName===undefined || storeName===null){
      return;
    }
    var promise = MyIdbService.db.getAllKeys(storeName);
    return promise;
  }

  async getAll(storeName){
    if(storeName===undefined || storeName===null){
      return;
    }
    var promise = MyIdbService.db.getAll(storeName);
    return promise;
  }
}
