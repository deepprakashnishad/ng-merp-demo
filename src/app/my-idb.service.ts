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

  downloadFile(data, headers, filename = 'data') {
    let csvData = this.ConvertToCSV(data, headers);
    let blob = new Blob(['\ufeff' + csvData],
        { type: 'text/csv;charset=utf-8;' });
    let dwldLink = document.createElement("a");
    let url = URL.createObjectURL(blob);
    let isSafariBrowser = navigator.userAgent.indexOf('Safari') !=
        -1 && navigator.userAgent.indexOf('Chrome') == -1;
    if (isSafariBrowser) {

        // If Safari open in new window to
        // save file with random filename.
        dwldLink.setAttribute("target", "_blank");
    }
    dwldLink.setAttribute("href", url);
    dwldLink.setAttribute("download", filename + ".csv");
    dwldLink.style.visibility = "hidden";
    document.body.appendChild(dwldLink);
    dwldLink.click();
    document.body.removeChild(dwldLink);
  }

  //headers contains json object with key as Header name and value as keys
  ConvertToCSV(data, headers) {
    let str = '';
    let row = 'S.No,';

    var keys = Object.keys(headers);

    for (let key of keys) {
      row += key + ',';
    }

    row = row.slice(0, -1);
    str += row + '\r\n';

    for (let i = 0; i < data.length; i++) {
        let line = (i + 1) + '';
        for (let key of keys) {
            let mKey = headers[key];
            if(mKey!==""){
              line += `,"${data[i][mKey]}"`;
            }
        }
        str += line + '\r\n';
        console.log(str);
    }

    return str;
  }

  async getTextFromFile(event: any) {
    const file: File = event.target.files[0];
    let fileContent = await file.text();
    
    return fileContent;
  }
}
