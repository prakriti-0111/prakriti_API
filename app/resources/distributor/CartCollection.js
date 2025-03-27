const { isObject, isEmpty, productTypeDisplay, isArray, getFileAbsulatePath } = require("@helpers/helper");
const {CartMaterialCollection} = require("@resources/distributor/CartMaterialCollection");

const CartCollection = (data) => {
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
    let cartMaterial = !isEmpty(data.cartMaterial) ? CartMaterialCollection(data.cartMaterial) : {};
    return {        
        id: data.id,
        product_id: data.product_id,
        product_type: !isEmpty(data.product) ? data.product.type : '',
        product_type_diplay: !isEmpty(data.product) ? productTypeDisplay(data.product.type) : '',
        product_name: !isEmpty(data.product) ? data.product.name : '',
        size_id: !isEmpty(data.size_id) ? data.size_id : '',
        size_name: !isEmpty(data.size) ? data.size.name : '',
        quantity: data.quantity,
        total_weight: data.total_weight ? data.total_weight : '',
        materials: cartMaterial
    }
}

module.exports = {
    CartCollection
}
