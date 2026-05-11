const { isObject, formatDateTime, isEmpty, displayAmount, paymentModeDisplay } = require("@helpers/helper");
const db = require("@models");
const PaymentModel = db.payments;

const PaymentCollection = async(data) => {
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

    let payment_mode = paymentModeDisplay(data.payment_mode);
    if(data.payment_mode == "cheque" && !isEmpty(data.cheque_no)){
        payment_mode += ' ( ' + data.cheque_no + ' )';
    }else if((data.payment_mode == "imps_neft") && !isEmpty(data.txn_id)){
        payment_mode += ' ( ' + data.txn_id + ' )';
    }

    let action_status = '', display_mode = '<p style="margin: 0;">'+payment_mode+'</p>';

    // Show 'processed' only for original pending rows that have been acted on (can_accept=false and no parent)
    if (data.can_accept === false && !data.parent_id && (data.status == 'pending' || data.status == 'failed')) {
        action_status = 'processed';
        if (data.payment_mode == "cheque") {
            if (!isEmpty(data.ref_no)) {
                display_mode += '<p style="margin: 0;font-size: 12px;">' + data.ref_no + '</p>';
            } else if (!isEmpty(data.reasons)) {
                display_mode += '<p style="margin: 0;font-size: 12px;">' + data.reasons + '</p>';
            }
        } else {
            if (!isEmpty(data.reasons)) {
                display_mode += '<p style="margin: 0;font-size: 12px;">' + data.reasons + '</p>';
            }
        }
    } else if (data.status == 'pending') {
        if (data.can_accept || data.parent_id) {
            action_status = 'Pending';
        } else {
            action_status = 'processed';
        }
    } else {
        if (data.payment_mode == "cheque") {
            action_status = (data.status == "success") ? "Accepted" : "Declined";
            if (data.status == "success" && !isEmpty(data.ref_no)) {
                display_mode += '<p style="margin: 0;font-size: 12px;">' + data.ref_no + '</p>';
            } else if (data.status != "success" && !isEmpty(data.reasons)) {
                display_mode += '<p style="margin: 0;font-size: 12px;">' + data.reasons + '</p>';
            }
        } else {
            action_status = (data.status == "failed") ? "Declined" : "Accepted";
            if (data.status != "success" && !isEmpty(data.reasons)) {
                display_mode += '<p style="margin: 0;font-size: 12px;">' + data.reasons + '</p>';
            }
        }
    }

    if(data.parent_id){
        let parentPay = await PaymentModel.findByPk(data.parent_id);
        if(data.status == 'pending' && parentPay.status == "pending" && data.can_accept){
            action_status = "Pending";
        }
    }
    let purpose = [data.purpose];
    if(!isEmpty(data.notes)){
        purpose.push(data.notes);
    }

    // If this is a pending payment that can be accepted by the current user,
    // represent credit as 0 and show the amount as 'To be processed' in the mode.
    let credit_amount = displayAmount(data.amount);
    if (data.status == 'pending' && data.can_accept) {
        credit_amount = 0;
        display_mode += '<p style="margin:0;font-size:12px;color:#ff9800;">To be processed: ' + displayAmount(data.amount) + '</p>';
    }

    return {
        id: data.id,
        amount: displayAmount(data.amount),
        payment_mode: paymentModeDisplay(data.payment_mode),
        notes: data.notes || '',
        cheque_no: data.cheque_no || '',
        txn_id: data.txn_id || '',
        weight: data.weight+" GM" || '',
        payment_date: formatDateTime(data.payment_date, 8),
        payment_to: data.user ? data.user.name : '',
        purpose: purpose,
        action_value: action_status,
        display_mode: display_mode,
        credit: credit_amount,
        can_accept: (data.status == 'pending' && data.can_accept) ? true : false
    }
}

module.exports = {
    PaymentCollection
}
