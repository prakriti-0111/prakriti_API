const { isObject, isEmpty, displayAmount, weightFormat } = require("@helpers/helper");

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
    let return_weight = weightFormat(data.return_weight);
    let return_qty = data.return_qty ? parseInt(data.return_qty) : 0;
    return {        
        id: data.id,
        order_id: data.order_id,
        product_id: data.product_id,
        material_id: data.material_id,
        size_id: data.size_id,
        stock_id: !isEmpty(data.stock_id) ? data.stock_id : '',
        weight: !isEmpty(data.weight) ? weightFormat(data.weight) : '',
        quantity: data.quantity,
        price: !isEmpty(data.price) ? displayAmount(data.price) : '',
        discount: !isEmpty(data.discount) ? displayAmount(data.discount) : '',
        discount_type: data.discount_type,
        total: !isEmpty(data.total) ? displayAmount(data.total) : '',
        status: data.status,
        purity_id: data.purity_id,
        unit_id: data.unit_id,
        material_name: material ? material.name : '',
        purity_name: purity ? purity.name : '',
        unit_name: unit ? unit.name : '',
        avl_qty: (parseInt(data.quantity) - return_qty),
        avl_weight: weightFormat(parseFloat(data.weight) - return_weight),
    }
}

module.exports = {
    OrderMaterialCollection
}
