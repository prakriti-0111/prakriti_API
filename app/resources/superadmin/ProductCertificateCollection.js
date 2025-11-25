const { isObject, isEmpty, getFileAbsulatePath } = require("@helpers/helper");

const ProductCertificateCollection = (data) => {
    if(!data){
        return [];
    }
    if(isObject(data)){
        return getModelObject(data);
    }else if(Array.isArray(data)){
        let arr = [];
        for(let i = 0; i < data.length; i++){
            arr.push(getModelObject(data[i]));
        }
        return arr;
    }else{
        return [];
    }
}

const getModelObject = (data) => {
    if(!data){
        return null;
    }
    return {
        id: data.id,
        name: data.name
    }
}

module.exports = {
    ProductCertificateCollection
}
