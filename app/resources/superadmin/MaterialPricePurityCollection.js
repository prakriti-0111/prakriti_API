const { isObject, isEmpty, displayAmount, priceFormat } = require("@helpers/helper");

const MaterialPricePurityCollection = (data) => {
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
        material_price_id: data.material_price_id,
        purity_id: data.purity_id,
        purity_name: !isEmpty(data.purity) ? data.purity.name : '',
        price: priceFormat(data.price),
        display_price: priceFormat(data.price),
        admin_discount: priceFormat(data.admin_discount),
        distributor_discount: priceFormat(data.distributor_discount),
        se_discount: priceFormat(data.se_discount),
        retailer_max_discount: priceFormat(data.retailer_max_discount),
        customer_discount: priceFormat(data.customer_discount),
        increase: priceFormat(data.increase),
        mrp: priceFormat(data.mrp),
        admin_price: priceFormat(data.admin_price),
        distributor_price: priceFormat(data.distributor_price),
        se_price: priceFormat(data.se_price),
        retailer_max_price: priceFormat(data.retailer_max_price),
        customer_price: priceFormat(data.customer_price),
        
    }
}

module.exports = {
    MaterialPricePurityCollection
}
