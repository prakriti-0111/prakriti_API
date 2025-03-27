const { isObject, isEmpty, displayAmount } = require("@helpers/helper");

const OrderMaterialCollection = (data) => {
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
    let material = data.material;
    let purity = data.purity;
    let unit = data.unit;
    return {        
        id: data.id,
        order_id: data.order_id,
        product_id: data.product_id,
        material_id: data.material_id,
        size_id: data.size_id,
        stock_id: !isEmpty(data.stock_id) ? data.stock_id : '',
        weight: !isEmpty(data.weight) ? data.weight : '',
        quantity: data.quantity,
        price: !isEmpty(data.price) ? displayAmount(data.price) : '',
        discount: !isEmpty(data.discount) ? displayAmount(data.discount) : '',
        discount_type: data.discount_type,
        total: !isEmpty(data.total) ? displayAmount(data.total) : '',
        status: data.status,
        material_name: material ? material.name : '',
        purity_name: purity ? purity.name : '',
        unit_name: unit ? unit.name : '',
    }
}

module.exports = {
    OrderMaterialCollection
}
