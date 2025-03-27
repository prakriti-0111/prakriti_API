const { isObject, isEmpty } = require("@helpers/helper");
const {PurityCollection} = require("@resources/retailer/PurityCollection");
const {MaterialPricePurityCollection} = require("@resources/retailer/MaterialPricePurityCollection");


const ProductMaterialCollection = (data) => {
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
        name: data.name,
        unit_name: ('unit' in data && !isEmpty(data.unit)) ? data.unit.name : '',
        purities: ('purities' in data && !isEmpty(data.purities)) ? PurityCollection(data.purities) : [],
        material_prices: (!isEmpty(data.material_price) && !isEmpty(data.material_price.materialPricePurities)) ? 
                          MaterialPricePurityCollection(data.material_price.materialPricePurities) : [],
    }
}

module.exports = {
    ProductMaterialCollection
}
