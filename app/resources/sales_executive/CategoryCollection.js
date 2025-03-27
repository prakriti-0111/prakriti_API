const { isObject } = require("@helpers/helper");
const { geStatusValue } = require("@library/common");
const {SubCategoryCollection} = require("@resources/sales_executive/SubCategoryCollection");

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
        status: data.status ? 1 : 0,
        status_display: geStatusValue(data.status),
        subCategories: SubCategoryCollection(data.subCategories)
    }
}

module.exports = {
    CategoryCollection
}
