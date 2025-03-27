const { isObject,getFileAbsulatePath, isEmpty, defaultProfileImage } = require("@helpers/helper");

const DistrictCollection = (data) => {
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
        country_id: data.country_id,
        state_id: data.state_id,
        name: data.name,
        country: !isEmpty(data.country) ? data.country.name : '',
        state: !isEmpty(data.state) ? data.state.name : ''
    }
}

module.exports = {
    DistrictCollection
}
