const { isObject, isEmpty, priceFormat } = require("@helpers/helper");
const {PurityCollection} = require("@resources/distributor/PurityCollection");
const {MaterialPricePurityCollection} = require("@resources/distributor/MaterialPricePurityCollection");


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
        material_id: data.material_id,
        weight: priceFormat(data.weight, true),
        quantity: data.quantity,
        purity_id: data.purity_id,
        name: data.material ? data.material.name : '',
        unit_name: ('unit' in data && !isEmpty(data.unit)) ? data.unit.name : '',
        purity_name: ('purity' in data && !isEmpty(data.purity)) ? data.purity.name : '',
        purities: ('purities' in data && !isEmpty(data.purities)) ? PurityCollection(data.purities) : []
    }
}

module.exports = {
    StockMaterialCollection
}
