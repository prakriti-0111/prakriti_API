const { isObject, isEmpty} = require("@helpers/helper");
const {MaterialPricePurityCollection} = require("@resources/customer/MaterialPricePurityCollection");

const MaterialPriceCollection = (data) => {
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
        material_name: !isEmpty(data.material) ? data.material.name : '',
        unit_name: (!isEmpty(data.material) && !isEmpty(data.material.unit)) ? data.material.unit.name : '',
        purities: MaterialPricePurityCollection(data.materialPricePurities)
    }
}

module.exports = {
    MaterialPriceCollection
}
