const { isObject, getFileAbsulatePath, isEmpty } = require("@helpers/helper");

const HomepageSettingCollection = (data) => {
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
        section_name: data.section_name,
        order: data.order,
        is_active: data.is_active
    }
}

module.exports = {
    HomepageSettingCollection
}
