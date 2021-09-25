export class StoreSettings {
  id: string;
  storeName: string;
  headerText: string;
  logo: any;
  isBrandEnabled: boolean;
  isTaxEnabled: boolean;
  enablePincodeChecker: boolean;

  constructor() {
    this.isBrandEnabled = true;
    this.isTaxEnabled = true;
    this.headerText = "Free shipping anywhere in India above ₹500";
    this.logo = { downloadUrl: "", uploadPath: "" };
    this.enablePincodeChecker = false;
  }

  static fromJSON(data) {
    var settings = new StoreSettings();
    settings.id = data['id'];
    settings.isBrandEnabled = data['isBrandEnabled'];
    settings.isTaxEnabled = data['isTaxEnabled'];
    settings.storeName = data['storeName'];
    settings.headerText = data['headerText'];
    settings.logo = data['logo'];
    return settings;
  }
}
