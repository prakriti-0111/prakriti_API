const { isObject, formatDateTime, isEmpty, displayAmount, ucWords } = require("@helpers/helper");
const {LoanDetailsCollection} = require("@resources/superadmin/LoanDetailsCollection");

const LoanListCollection = (data) => {
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
        investor_name: data.investor ? data.investor.name : '',
        investor_mobile: data.investor ? data.investor.mobile : '',
        investor_address: data.investor ? data.investor.address : '',
        loan_amount: displayAmount(data.loan_amount),
        interest_display: displayAmount(data.interest_display) + '%',
        interest_display_type: ucWords(data.interest_display_type),
        interest_amount: displayAmount(data.interest_amount),
        total_with_interest: displayAmount(parseFloat(data.loan_amount) + parseFloat(data.interest_amount)),
        monthly_emi: displayAmount(data.monthly_emi),
        due_amount: displayAmount(data.due_amount),
        total_months: data.total_months + ' months',
        start_date: formatDateTime(data.start_date, 8),
        due_date: formatDateTime(data.due_date, 8),
        status: data.status
    }
}

module.exports = {
    LoanListCollection
}
