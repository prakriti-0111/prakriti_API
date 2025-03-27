const { isObject, getFileAbsulatePath, isEmpty } = require("@helpers/helper");
const { geStatusValue } = require("@library/common");
const {SubCategoryCollection} = require("@resources/customer/SubCategoryCollection");

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

    let subCategories = 'subCategories' in data ? SubCategoryCollection(data.subCategories) : [];
    subCategories.sort((a, b) => a.name.localeCompare(b.name, 'en', { numeric: true }));

    return {
        id: data.id,
        name: data.name,
        slug: data.slug,
        status: data.status ? 1 : 0,
        status_display: geStatusValue(data.status),
        subCategories: subCategories,
        Mobile:!isEmpty(data.Mobile)?getFileAbsulatePath(data.Mobile):'',
        banner: !isEmpty(data.banner) ? getFileAbsulatePath(data.banner) : '',
        icon: !isEmpty(data.icon) ? getFileAbsulatePath(data.icon) : '',
    }
}

module.exports = {
    CategoryCollection
}
