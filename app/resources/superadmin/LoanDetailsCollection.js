const { isObject, formatDateTime, isEmpty, displayAmount, paymentModeDisplay } = require("@helpers/helper");

const LoanDetailsCollection = (data) => {
    if(isObject(data)){
        return getModelObject(data);
    }else{
        let arr = [];
        for(let i = 0; i < data.length; i++){
            arr.push(getModelObject(data[i]));
        }
        return arr;
    }
}

const getModelObject = (data) => {
    return {
        id: data.id,
        type: data.type,
        principal_amount: displayAmount(data.principal_amount),
        principal_due_amount: displayAmount(data.principal_due_amount),
        interest_amount: displayAmount(data.interest_amount),
        amount: displayAmount(data.amount),
        remaining_balance: displayAmount(data.remaining_balance),
        emi: displayAmount(data.emi),
        interest_due_date: formatDateTime(data.interest_due_date, 8),
        payment_receive_date: formatDateTime(data.payment_receive_date, 7),
        status: data.status,
        payment_mode: paymentModeDisplay(data.payment_mode)
    }
}

module.exports = {
    LoanDetailsCollection
}
