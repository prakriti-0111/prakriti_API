const { isObject,isEmpty } = require("@helpers/helper");

const LeaveApplicationCollection = (data) => {
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
        user_id: data.user_id,
        status: data.status,
        title: data.title,
        message: data.message,
        userName: !isEmpty(data.user) ? data.user.name: '',
        role: !isEmpty(data.user)&& !isEmpty(data.user.role) ? data.user.role.display_name: '',

    }
}

module.exports = {
    LeaveApplicationCollection
}
