const { isObject, isEmpty, getFormatedAddress } = require("@helpers/helper");
const { geStatusValue } = require("@library/common");

const AddressCollection = (data) => {
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
    let addressObj = {
        id: data.id,
        user_id: data.user_id,
        type: data.type,
        name: data.name,
        street: data.street,
        landmark: data.landmark,
        city: data.city,
        state: data.state ? data.state.name : '',
        zipcode: data.zipcode,
        country: data.country ? data.country.name : '',
        district: data.district ? data.district.name : '',
        contact: data.contact,
        lat: !isEmpty(data.lat) ? data.lat: '',
        lng: !isEmpty(data.lng) ? data.lng: '',
        country_id: data.country_id,
        state_id: data.state_id,
        district_id: data.district_id
    };

    let formated_address = getFormatedAddress(addressObj);

    return {
        ...addressObj,
        formated_address: formated_address
    }
}

module.exports = {
    AddressCollection
}
