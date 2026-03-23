const { isObject,getFileAbsulatePath, isEmpty, defaultProfileImage } = require("@helpers/helper");

const UserCollection = (data) => {
    if(isEmpty(data)){
        return null;
    }

    if(isObject(data)){
        return getModelObject(data);
    }else if(Array.isArray(data)){
        let arr = [];
        for(let i = 0; i < data.length; i++){
            if(!isEmpty(data[i])){
                arr.push(getModelObject(data[i]));
            }
        }
        return arr;
    }

    return null;
}

const getModelObject = (data) => {
    return {
        id: data.id,
        email: isEmpty(data.email) ? "" : data.email,
        name: data.name,
        company_name: data.company_name,
        mobile: isEmpty(data.mobile) ? "" : data.mobile,
        image: (!isEmpty(data.profile_image)) ? getFileAbsulatePath(data.profile_image) : defaultProfileImage(),
        own: data.own,
        role_name: "Super Admin",
        country_id: data.country_id,
        state_id: data.state_id,
        gst: data.gst
    }
}

module.exports = {
    UserCollection
}
