const { isObject, isEmpty } = require("@helpers/helper");
const {StockMaterialCollection} = require("@resources/customer/StockMaterialCollection");

const StocksCollection = (data) => {
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

    let stock_materials  = [];

    if((!isEmpty(data)) && (!isEmpty(data.stockMaterials))){
        stock_materials = StockMaterialCollection(data.stockMaterials);
    }

    return {        
        id: data.id,
        product_id: data.product_id,
        purchase_id: !isEmpty(data.purchase_id) ? data.purchase_id : '',
        sale_id: !isEmpty(data.sale_id) ? data.sale_id : '',
        size_id: !isEmpty(data.size_id) ? data.size_id : '',
        sizeName: !isEmpty(data.size) ? data.size.name : '',
        productName: !isEmpty(data.product) ? data.product.name : '',
        certificate_no: !isEmpty(data.certificate_no) ? data.certificate_no : '',
        weight: !isEmpty(data.total_weight) ? data.total_weight : '',
        quantity: !isEmpty(data.quantity) ? data.quantity : '',
        stock_materials: stock_materials
    }
}

module.exports = {
    StocksCollection
}
