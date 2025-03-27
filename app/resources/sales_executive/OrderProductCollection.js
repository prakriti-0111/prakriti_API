const { isObject, isEmpty, productTypeDisplay, isArray, getFileAbsulatePath, displayAmount } = require("@helpers/helper");
const {OrderMaterialCollection} = require("@resources/sales_executive/OrderMaterialCollection");

const OrderProductCollection = (data) => {
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
    let materials = !isEmpty(data.orderProductMaterials) ? OrderMaterialCollection(data.orderProductMaterials) : [];
    let image = '';
    if(data.product && isArray(data.product.images) && data.product.images.length){
        image = getFileAbsulatePath(data.product.images[0].path);
    }
    return {        
        id: data.id,
        product_id: data.product_id,
        product_type: !isEmpty(data.product) ? data.product.type : '',
        product_type_diplay: !isEmpty(data.product) ? productTypeDisplay(data.product.type) : '',
        product_name: !isEmpty(data.product) ? data.product.name : '',
        size_id: !isEmpty(data.size_id) ? data.size_id : '',
        size_name: !isEmpty(data.size) ? data.size.name : '',
        quantity: data.quantity,
        materials: materials,
        image: image,
        rate: displayAmount(data.rate)
    }
}

module.exports = {
    OrderProductCollection
}
