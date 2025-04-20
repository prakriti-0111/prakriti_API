const { isObject, formatDateTime, isEmpty, getFileAbsulatePath, ucWords } = require("@helpers/helper");
const { isSalesExecutive } = require("@library/common");

const ExpenseCollection = (data, req, authID) => {
    if(isObject(data)){
        return getModelObject(data, req, authID);
    }else{
        let arr = [];
        for(let i = 0; i < data.length; i++){
            arr.push(getModelObject(data[i], req, authID));
        }
        return arr;
    }
}

const getModelObject = (data, req, authID) => {
    let display_explanation = '';
    
    if(!isEmpty(data.explanation)){
        display_explanation = data.explanation.charAt(0).toUpperCase() + data.explanation.slice(1);
    }
    let action_value = ucWords(data.status);
    let can_accept = false, can_edit = false;
    if(authID && data.status == 'pending' && !isEmpty(data.user_id) && data.created_by != authID){
        can_accept = true;
    }
    if(authID && data.status == 'pending' && data.created_by == authID){
        can_edit = true;
    }
    let type = '';
    if(data.type == 'issue'){
        type = 'Issue Amount';
    }else{
        type = 'Expense';
    }

    return {
        id: data.id,
        reason_id: !isEmpty(data.reason_id) ? data.reason_id: '',
        user_id: !isEmpty(data.user_id) ? data.user_id: '',
        user_name: 'user' in data && data.user ? data.user.name : '',
        date: !isEmpty(data.date) ? formatDateTime(data.date, 9)    : '',
        description: !isEmpty(data.description) ? data.description: '',
        amount: !isEmpty(data.amount) ? data.amount: '',
        bill_image: !isEmpty(data.bill_image) ? getFileAbsulatePath(data.bill_image): '',
        existing_bill_image: !isEmpty(data.bill_image) ? getFileAbsulatePath(data.bill_image): '',
        explanation: !isEmpty(data.explanation) ? data.explanation: '',
        display_explanation: display_explanation,
        reason: !isEmpty(data.reason) ? data.reason.name: '',
        status: data.status,
        can_edit: req.userId == data.created_by && data.status == "pending",
        action_value: action_value,
        can_accept: can_accept,
        can_edit: can_edit,
        type: type
    }
}

module.exports = {
    ExpenseCollection
}
