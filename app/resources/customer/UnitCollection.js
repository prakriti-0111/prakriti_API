const { isObject } = require("@helpers/helper");

const UnitCollection = (data) => {
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
        name: data.name,
        unit: data.unit,
        rate: data.rate
    }
}

module.exports = {
    UnitCollection
}
