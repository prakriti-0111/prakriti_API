const { isObject, getFileAbsulatePath, isEmpty } = require("@helpers/helper");
const { geStatusValue } = require("@library/common");

const CategoryCollection = (data) => {
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
        slug: data.slug,
        //is_material: data.is_material ? 1 : 0,
        //is_certified_display: data.is_material ? 'No' : 'Yes',
        is_material: data.is_material ? 1 : 0,
        is_ceritified: data.is_ceritified ? 1 : 0,
        is_material_display: data.is_material ? 'Yes': 'No',
        is_certified_display: data.is_ceritified ? 'Yes': 'No',
        status: data.status ? 1 : 0,
        front: data.front ? 1 : 0,
        status_display: geStatusValue(data.status),
        front_display: data.front ? 'Yes' : 'No',
        Mobile:!isEmpty(data.Mobile)?getFileAbsulatePath(data.Mobile):'',
        banner: !isEmpty(data.banner) ? getFileAbsulatePath(data.banner) : '',
        icon: !isEmpty(data.icon) ? getFileAbsulatePath(data.icon) : '',
    }
}

module.exports = {
    CategoryCollection
}
