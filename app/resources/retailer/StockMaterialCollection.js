const { isObject, isEmpty } = require("@helpers/helper");
const {PurityCollection} = require("@resources/retailer/PurityCollection");
const {UnitCollection} = require("@resources/retailer/UnitCollection");
const {StockProductMaterialCollection} = require("@resources/retailer/StockProductMaterialCollection");

const StockMaterialCollection = (data) => {
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
        stock_id: data.stock_id,
        material_id: data.material_id,
        purity_id: data.purity_id,
        unit_id: data.unit_id,
        weight: data.weight,
        quantity: data.quantity,
        material: !isEmpty(data.material) ? StockProductMaterialCollection(data.material): [],
        unit: UnitCollection(data.unit),
        purity: PurityCollection(data.purity) ,
        purities: !isEmpty(data.material) && !isEmpty(data.material.purities) ? PurityCollection(data.material.purities) : [],
    }
}

module.exports = {
    StockMaterialCollection
}
