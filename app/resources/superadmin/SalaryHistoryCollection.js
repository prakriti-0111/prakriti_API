const { isObject, displayAmount, formatDateTime, ucWords } = require("@helpers/helper");


const SalaryHistoryCollection = (data) => {
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

    let display_date = data.type == 'salary' ? formatDateTime(data.salary_date, 8) : formatDateTime(data.createdAt, 7)
    return {
        id: data.id,
        type: data.type,
        credit: data.type == "repayment" ? displayAmount(data.net) : displayAmount(0),
        debit: data.type != "repayment" ? displayAmount(data.net) : displayAmount(0),
        balance: displayAmount(data.balance),
        display_date: display_date,
        status: ucWords(data.status),
    }
}

module.exports = {
    SalaryHistoryCollection
}
