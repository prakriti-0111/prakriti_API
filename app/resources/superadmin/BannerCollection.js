const { isObject, getFileAbsulatePath, isEmpty } = require("@helpers/helper");

const BannerCollection = (data) => {
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
        title: data.title,
        url: data.url,
        sort_by: data.sort_by,
        image: !isEmpty(data.image) ? getFileAbsulatePath(data.image) : ''
    }
}

module.exports = {
    BannerCollection
}
