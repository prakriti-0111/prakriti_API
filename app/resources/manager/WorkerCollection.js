const { isObject,getFileAbsulatePath, isEmpty, defaultProfileImage } = require("@helpers/helper");


const WorkerCollection = (data) => {
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
        mobile: isEmpty(data.mobile) ? "" : data.mobile,
        role_name: "Worker"
    }
}

module.exports = {
    WorkerCollection
}
