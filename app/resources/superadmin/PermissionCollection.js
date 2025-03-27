const { isObject,getFileAbsulatePath, isEmpty, defaultProfileImage } = require("@helpers/helper");

const PermissionCollection = (data) => {
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
        name: data.name,
        list: data.list,
        view: data.view,
        add: data.add,
        edit: data.edit,
        delete: data.delete
    }
}

module.exports = {
    PermissionCollection
}
