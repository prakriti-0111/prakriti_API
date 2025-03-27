const { isObject, isEmpty, formatDateTime, displayAmount } = require("@helpers/helper");
const {OrderProductCollection} = require("@resources/sales_executive/OrderProductCollection");

const OrderCollection = (data) => {
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
    let address = JSON.parse(data.delivery_address);
    return {        
        id: data.id,
        user_id: data.user_id,
        order_no: data.order_no,
        sub_total: !isEmpty(data.sub_total) ? displayAmount(data.sub_total) : '',
        discount_amount: !isEmpty(data.discount_amount) ? displayAmount(data.discount_amount) : '',
        total_amount: !isEmpty(data.total_amount) ? displayAmount(data.total_amount) : '',
        payment_mode: (data.payment_mode == 'cash') ? 'Cash' : 'Online',
        delivery_address: !isEmpty(address) ? address.formated_address : '',
        status: data.status,
        order_date: formatDateTime(data.createdAt, 5),
        orderProducts: !isEmpty(data.orderProducts) ? OrderProductCollection(data.orderProducts) : [],
        cancel_reason: data.cancel_reason ?? ""
    }
}

module.exports = {
    OrderCollection
}
