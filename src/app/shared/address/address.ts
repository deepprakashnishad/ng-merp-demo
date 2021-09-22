export class Address{
    id: string;
    name: string;
    line1: string;
    line2: string;
    pincode: string;
    area: string;
    city: string;
    state: string;
    landmark: string;
    country: string;
    type: string;
    mob1: string;
    mob2: string;
    forType: string;
    forId: string;

    constructor(){
        this.country = "India";
    }

    static fromJSON(data): Array<Address>{
        var addresses:Array<Address> = [];

        data.forEach(ele => {
            var address = new Address();
            address.id = ele['id'];
            address.name = ele['name'];
            address.area = ele['area'];
            address.country = ele['country'];
            address.line1 = ele['line1'];
            address.line2 = ele['line2'];
            address.landmark = ele['landmark'];
            address.pincode = ele['pincode'];
            address.city = ele['city'];
            address.state = ele['state'];
            address.type = ele['type'];
            address.mob1 = ele['mob1'];
            address.mob2 = ele['mob2'];
            address.forType = ele['forType'];
            address.forId = ele['forId'];
            addresses.push(address);
        });

        return addresses;
    }
}