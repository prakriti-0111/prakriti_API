const { isObject } = require("@helpers/helper");

const ItemCollection = (data) => {
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
        name: data.name,
        item_type : data.item_type,
        category_id : data.category_id,
        sub_category_id : data.sub_category_id,
        material_id : data.material_id,
        tax_rate_id : data.tax_rate_id,
        certificate_id : data.certificate_id,
        lic_no : data.lic_no,
        size : data.size,
        purity_id : data.purity_id,
        unit_id : data.unit_id,
        qty : data.qty,
        is_making_charge : data.is_making_charge,
        making_charge : data.making_charge,
        discount_type : data.discount_type,
        discount : data.discount,
    }
}

module.exports = {
    ItemCollection
}
