const { isObject,getFileAbsulatePath, isEmpty, defaultProfileImage } = require("@helpers/helper");

const BankDetailsCollection = (data) => {
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
        user_id: data.user_id,
        salary: !isEmpty(data.salary) ? data.salary : '',
        bank_name: !isEmpty(data.bank_name) ? data.bank_name : '',
        account_no: !isEmpty(data.account_no) ? data.account_no : '',
        ifsc_code: !isEmpty(data.ifsc_code) ? data.ifsc_code : '',
        paid_leave: !isEmpty(data.paid_leave) ? data.paid_leave : '',
        parent_name: !isEmpty(data.parent_name) ? data.parent_name : '',  
        alternative_no: !isEmpty(data.alternative_no) ? data.alternative_no : '',
        alternative_address: !isEmpty(data.alternative_address) ? data.alternative_address : '',
    }
}

module.exports = {
    BankDetailsCollection
}
