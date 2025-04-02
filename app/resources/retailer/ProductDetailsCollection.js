const { isObject, isEmpty } = require("@helpers/helper");

const ProductDetailsCollection = (data) => {
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
        product_id: data.product_id,
        material_id: data.material_id,
        attribute_id: data.attribute_id,
    }
}

module.exports = {
    ProductDetailsCollection
}
