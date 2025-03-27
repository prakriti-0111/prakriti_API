const { isObject, getFileAbsulatePath, isEmpty, isArray, upperCase } = require("@helpers/helper");


const CustomerCollection = (data) => {
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
        email: data.email ?? "",
        mobile: data.mobile ?? "",
        city: data.city ?? "",
        landmark: data.landmark ?? "",
        pincode: data.pincode ?? "",
        state: data.state ? data.state.name : '',
        country: data.country ? data.country.name : '',
        district: data.district ? data.district.name : '',
        profile_image: (!isEmpty(data.profile_image)) ? getFileAbsulatePath(data.profile_image) : '',
    }
}

module.exports = {
    CustomerCollection
}
