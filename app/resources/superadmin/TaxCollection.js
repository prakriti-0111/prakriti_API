const { isObject } = require("@helpers/helper");

const TaxCollection = (data) => {
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
        cgst: data.cgst,
        sgst: data.sgst,
        igst: data.igst
    }
}

module.exports = {
    TaxCollection
}
