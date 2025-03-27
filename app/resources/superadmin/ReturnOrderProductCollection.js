const { isObject, isEmpty, productTypeDisplay, isArray, getFileAbsulatePath, weightFormat, displayAmount } = require("@helpers/helper");
const {OrderMaterialCollection} = require("@resources/distributor/OrderMaterialCollection");

const ReturnOrderProductCollection = (data) => {
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
    let materials = !isEmpty(data.returnMaterials) ? OrderMaterialCollection(data.returnMaterials) : [];
    let orderProduct = data.orderProduct;
    let product = orderProduct ? orderProduct.product : null;

    //---
    let weight_display = [], unit_display = [];
    let materialItem = [], materialString = [];
    for(let item of materials){
        let str = item.material_name;
        materialItem.push({
            material_id: item.material_id,
            material_name: item.material_name,
            weight: item.weight,
            unit_name: item.unit_name,
            quantity: item.quantity,
            unit_id: item.unit_id,
            purity_id: item.purity_id,
            purity_name: item.purity_name
        });
        materialString.push(str);
        if(product && product.type == "material"){
            weight_display.push(weightFormat(item.quantity));
        }else{
            weight_display.push(weightFormat(item.weight));
        }
        unit_display.push((item.unit_name ? item.unit_name : '-'));
    }
    let total_weight_display = '';
    if(materialItem.length == 1){
        total_weight_display = weightFormat(materialItem[0].weight) + ' , ' + materialItem[0].unit_name;
    }else{
        total_weight_display = weightFormat(orderProduct.total_weight) + ' , gm';
    }
    //---
    let main_image = product && !isEmpty(product.main_image) ? getFileAbsulatePath(product.main_image) : '';

    return {        
        id: data.id,
        product_id: product ? product.id : 0,
        product_type: !isEmpty(product) ? product.type : '',
        product_type_diplay: !isEmpty(product) ? productTypeDisplay(product.type) : '',
        product_name: !isEmpty(product) ? product.name : '',
        product_code: !isEmpty(product) ? product.product_code : '',
        category_name: !isEmpty(product) && 'category' in product && product.category ? product.category.name : '',
        certificate_no: orderProduct.certificate_no,
        size_id: !isEmpty(orderProduct.size_id) ? orderProduct.size_id : '',
        size_name: !isEmpty(orderProduct.size) ? orderProduct.size.name : '',
        quantity: orderProduct.quantity,
        rate: displayAmount(data.rate),
        materials: materials,
        image: main_image,
        total_weight_display: total_weight_display,
        stock_material_display: materialString,
        weight_display: weight_display,
        unit_display: unit_display
    }
}

module.exports = {
    ReturnOrderProductCollection
}
