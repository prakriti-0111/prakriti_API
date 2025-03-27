const { isObject, formatDateTime } = require("@helpers/helper");

const RetailerReviewCollection = (data) => {
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
        rating: parseFloat(data.rating),
        review: data.review,
        user_name: data.user ? data.user.name : '',
        user_mobile: data.user ? data.user.mobile : '',
        created_at: formatDateTime(data.createdAt, 7)
    }
}

module.exports = {
    RetailerReviewCollection
}
