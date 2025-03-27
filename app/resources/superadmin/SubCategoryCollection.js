const { isObject, isEmpty } = require("@helpers/helper");
const { geStatusValue, getMakingChargeType } = require("@library/common");

const SubCategoryCollection = (data) => {
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
        name: data.name,
        slug: data.slug,
        hsn_code: data.hsn_code,
        making_charge: !isEmpty(data.making_charge) ? data.making_charge : '',
        making_charge_display: (!isEmpty(data.making_charge) ? (data.making_charge + getMakingChargeType(data.making_charge_type)) : ''),
        base_price: !isEmpty(data.base_price) ? data.base_price : '',
        increase: !isEmpty(data.increase) ? data.increase : '',
        making_charge_type: !isEmpty(data.making_charge_type) ? data.making_charge_type : '',
        making_charge_type_display: getMakingChargeType(data.making_charge_type),
        status: data.status ? 1 : 0,
        status_display: geStatusValue(data.status),
        category: !isEmpty(data.category) ? data.category.name : '',
        admin_discount: !isEmpty(data.admin_discount) ? data.admin_discount : '',
        distributor_discount: !isEmpty(data.distributor_discount) ? data.distributor_discount : '',
        retailer_discount: !isEmpty(data.retailer_discount) ? data.retailer_discount : '',
        customer_discount: !isEmpty(data.customer_discount) ? data.customer_discount : '',

    }
}

module.exports = {
    SubCategoryCollection
}
