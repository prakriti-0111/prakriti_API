const { isObject, isEmpty, getFileAbsulatePath } = require("@helpers/helper");

const ProductSizeCollection = (data) => {
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
        name: data.name
    }
}

module.exports = {
    ProductSizeCollection
}
