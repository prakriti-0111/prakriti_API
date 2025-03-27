const { isObject, isEmpty } = require("@helpers/helper");


const RetailerCollection = (data) => {
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
        district_id: !isEmpty(data.district_id) ? data.district_id : '',
        district: !isEmpty(data.district) ? data.district.name : '',
        name: data.name,
        role_name: "Retailer"
    }
}

module.exports = {
    RetailerCollection
}
