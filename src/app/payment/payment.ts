export class Payment{
    id: string;
    amount: number;
    currency: string;
    channel: string;
    method: string;
    status: string;
    channelTransactionId: string;
    details: any;
    isCredit: boolean=true;
    order: string;

    constructor(){
        this.isCredit = true;
    }

    static fromJSON(data) : Payment{
        var payment = new Payment();
        payment.id = data['id'];
        payment.amount = data['amount'];
        payment.channel = data['channel'];
        payment.channelTransactionId = data['transactionId'];
        payment.details = data['details'];
        payment.isCredit = data['isCredit'];
        payment.order = data['order'];
        payment.status = data['status'];
        return payment;
    }

    static fromJSONArray(dataJSON){
        if(dataJSON===null){
            return null;
        }else{
            var paymentDetails: Array<Payment> = [];
            dataJSON.forEach(data => {
                var payment = new Payment();
                payment.id = data['id'];
                payment.amount = data['amount'];
                payment.channel = data['channel'];
                payment.channelTransactionId = data['transactionId'];
                payment.details = data['details'];
                payment.isCredit = data['isCredit'];
                payment.order = data['order'];
                payment.status = data['status'];
                paymentDetails.push(payment);
            });
            return paymentDetails;
        }
    }
};