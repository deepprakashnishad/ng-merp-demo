import { Injectable } from '@angular/core';
import { noop } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MyCsvService {

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
            var mKeyParts = mKey.split(".");
            if(mKeyParts.length===1){
              line += `,"${data[i][mKey]}"`;
            }else if(mKeyParts.length===2 && mKeyParts[0]==="prices"){
              var temp = data[i]['prices'][0];
              if(mKeyParts[1]==="discountedPrice"){
                var discounts = temp['discounts'];
                if(discounts && discounts.length>0){
                  for(let disc of discounts){
                    if(disc.minQty===1){
                      line += `,"${disc['salePrice']?disc['salePrice']:""}"`;
                    }else{
                      line += `,`;
                    }
                  }
                }else{
                  line += `,`;
                }
              }else{
                line += `,"${temp[mKeyParts[1]]?temp[mKeyParts[1]]:""}"`;  
              }                
            }else if(mKeyParts.length===3){
              line += `,"${data[i][mKeyParts[0]][mKeyParts[1]][mKeyParts[2]]?data[i][mKeyParts[0]][mKeyParts[1]][mKeyParts[2]]:""}"`;
            }
          }else{
            line += `,`;  
          }
      }
      // str += line + '\r\n';
      str += line + '\n';
    }

    return str;
  }

  public importDataFromCSV(csvText: string): Array<any> {
    const propertyNames = csvText.slice(0, csvText.indexOf('\n')).split(',').map(ele=>ele.trim());
    // propertyNames = propertyNames.map(ele=>ele.trim());
    const dataRows = csvText.slice(csvText.indexOf('\n') + 1).split('\n');

    let dataArray: any[] = [];
    dataRows.forEach((row) => {
      let values = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);

      let obj: any = new Object();

      for (let index = 0; index < propertyNames.length; index++) {
        const propertyName: string = propertyNames[index];

        let val: any = values[index];
        if (val === '') {
          val = null;
        }

        obj[propertyName] = val;
      }

      dataArray.push(obj);
    });
    return dataArray;
  }
}
