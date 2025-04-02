const { isObject,getFileAbsulatePath, isEmpty, defaultProfileImage } = require("@helpers/helper");

const SizeCollection = (data) => {
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
        category_id: data.category_id,
        sub_category_id: data.sub_category_id,
        category_name: ('category' in data && data.category) ? data.category.name : '',
        sub_category_name: ('sub_category' in data && data.sub_category) ? data.sub_category.name : '',
    }
}

module.exports = {
    SizeCollection
}
