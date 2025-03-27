const { isObject, isEmpty, formatDateTime, displayAmount, statusDisplay, getFormatedAddress } = require("@helpers/helper");

const ReturnOrderListCollection = (data) => {
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
    let order = data.order;
    let order_from = ('orderFrom' in order && order.orderFrom) ? order.orderFrom.name : '';
    if('orderFrom' in order && order.orderFrom && 'role' in order.orderFrom && order.orderFrom.role){
        order_from += ' ( ' + order.orderFrom.role.name + ' )';
    }

    let sale_executive_name = ('saleExecutive' in data && data.saleExecutive) ? data.saleExecutive.name : '';
    let delivery_address = JSON.parse(order.delivery_address);
    let mobile = !isEmpty(delivery_address) ? delivery_address.contact : '';
    if(isEmpty(mobile) && 'orderFrom' in order && order.orderFrom){
        mobile = order.orderFrom.mobile;
    }

    return {
        id: data.id,
        order_no: order.order_no,
        sub_total: !isEmpty(data.sub_total) ? displayAmount(data.sub_total) : '',
        discount_amount: !isEmpty(data.discount_amount) ? displayAmount(data.discount_amount) : '',
        total_amount: !isEmpty(data.total_amount) ? displayAmount(data.total_amount) : '',
        status: data.status,
        status_display: statusDisplay(data.status),
        order_date: formatDateTime(data.createdAt, 7),
        order_from: order_from,
        mobile: mobile,
        sale_executive_name: sale_executive_name,
        formated_address: getFormatedAddress(delivery_address),
        no_of_products: data.returnProducts.length,
        city: !isEmpty(delivery_address) && 'city' in delivery_address ? delivery_address.city : ''
    }
}

module.exports = {
    ReturnOrderListCollection
}
