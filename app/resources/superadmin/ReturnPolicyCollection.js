const { isObject } = require("@helpers/helper");
const { priceFormat, ucWords } = require("@helpers/helper");

const ReturnPolicyCollection = (data) => {
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
        category_id: data.category_id,
        role: data.role,
        role_display: ucWords(data.role),
        days: data.days,
        amount: data.amount,
        amount_display: priceFormat(data.amount, true) + '%',
        category_name: data.category ? data.category.name : ''
    }
}

module.exports = {
    ReturnPolicyCollection
}
