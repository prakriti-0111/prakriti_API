const { isObject, isEmpty } = require("@helpers/helper");
const { geStatusValue } = require("@library/common");

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
        making_charge_type: data.making_charge_type,
        making_charge: !isEmpty(data.making_charge) ? data.making_charge : '',
        status: data.status ? 1 : 0,
        status_display: geStatusValue(data.status),
    }
}

module.exports = {
    SubCategoryCollection
}
