const { isObject, formatDateTime, isEmpty, displayAmount, paymentModeDisplay } = require("@helpers/helper");
const db = require("@models");
const PaymentModel = db.payments;

const WalletCollection = async(data) => {
    if(isObject(data)){
        return await getModelObject(data);
    }else{
        let arr = [];
        for(let i = 0; i < data.length; i++){
            arr.push(await getModelObject(data[i]));
        }
        return arr;
    }
}

const getModelObject = async(data) => {
    let debit_amount = 0;
    let credit_amount = 0;
    if(data.type == 'debit'){
        debit_amount = displayAmount(data.amount);
    }else{
        credit_amount = displayAmount(data.amount);
    }

    let companny_name = '', user_name = '', user_city = '';
    let display_user_details = [];
    if(data.user){
        companny_name = data.user.company_name || '';
        user_name = data.user.name || '';
        user_city = data.user.city || '';
        display_user_details.push('Company Name: ' + companny_name);
        display_user_details.push('Name: ' + user_name);
        display_user_details.push('City: ' + user_city);
    }

    let payment_mode = paymentModeDisplay(data.payment_mode);
    if(data.payment_mode == "cheque" && !isEmpty(data.cheque_no)){
        payment_mode += ' ( ' + data.cheque_no + ' )';
    }else if((data.payment_mode == "imps_neft") && !isEmpty(data.txn_id)){
        payment_mode += ' ( ' + data.txn_id + ' )';
    }

    let action_status = '', display_mode = '<p style="margin: 0;">'+payment_mode+'</p>';
    if(data.payment_mode == "cheque" && data.status != "pending"){
        action_status = (data.status == "success") ? "Accepted" : "Declined";
        if(data.status == "success" && !isEmpty(data.ref_no)){
            display_mode += '<p style="margin: 0;font-size: 12px;">' + data.ref_no + '</p>';
        }else if(data.status != "success" && !isEmpty(data.reasons)){
            display_mode += '<p style="margin: 0;font-size: 12px;">' + data.reasons + '</p>';
        }
    }else if(data.status != "pending"){
        if(data.status == "failed"){
            action_status = "Declined";
        }else{
            action_status = "Accepted";
        }
    }

    if(data.parent_id){
        let parentPay = await PaymentModel.findByPk(data.parent_id);
        if(parentPay.status == "pending"){
            action_status = "Pending";
        }
    }
    let purpose = [data.purpose];
    if(!isEmpty(data.notes)){
        purpose.push(data.notes);
    }
    
    return {
        id: data.id,
        amount: displayAmount(data.amount),
        payment_mode: payment_mode,
        notes: data.notes || '',
        cheque_no: data.cheque_no || '',
        debit: (debit_amount),
        credit: (credit_amount),
        txn_id: data.txn_id || '',
        remaining_balance: displayAmount(data.remaining_balance || 0),
        payment_date: formatDateTime(data.payment_date, 8),
        payment_to: data.user ? data.user.name : '',
        status: data.status,
        purpose: purpose,
        type: data.type,
        display_user_details: display_user_details,
        action_value: action_status,
        display_mode: display_mode,
        can_accept: data.can_accept
    }
}

module.exports = {
    WalletCollection
}
