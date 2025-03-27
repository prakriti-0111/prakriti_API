const { isObject,getFileAbsulatePath, isEmpty, defaultProfileImage } = require("@helpers/helper");

const UserCollection = (data) => {
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
        email: isEmpty(data.email) ? "" : data.email,
        name: data.name,
        company_name: data.company_name,
        own: data.own,
        mobile: isEmpty(data.mobile) ? "" : data.mobile,
        image: (!isEmpty(data.profile_image)) ? getFileAbsulatePath(data.profile_image) : defaultProfileImage(),
        role_name: "Manager"
    }
}

module.exports = {
    UserCollection
}
