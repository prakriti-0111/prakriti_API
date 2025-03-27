const { isObject, formatDateTime, isEmpty, displayAmount, ucWords } = require("@helpers/helper");
const {LoanDetailsCollection} = require("@resources/superadmin/LoanDetailsCollection");

const LoanCollection = (data) => {
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
        principal_amount: displayAmount(data.principal_amount),
        interest: displayAmount(data.interest) + '%',
        interest_display: displayAmount(data.interest_display) + '%',
        due_amount: displayAmount(data.due_amount),
        monthly_emi: displayAmount(data.monthly_emi),
        total_months: data.total_months + ' Months',
        start_date: formatDateTime(data.start_date, 8),
        due_date: formatDateTime(data.due_date, 8),
        status: data.status,
        interest_display_type: ucWords(data.interest_display_type),
        loan_details: LoanDetailsCollection(data.loanDetails),
        interest_amount: displayAmount(data.interest_amount),
        total_paid: displayAmount(data.total_paid),
        total_with_interest: displayAmount(parseFloat(data.loan_amount) + parseFloat(data.interest_amount)),
    }
}

module.exports = {
    LoanCollection
}
