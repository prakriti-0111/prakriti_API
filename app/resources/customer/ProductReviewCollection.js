const { isObject, formatDateTime, isEmpty, getFileAbsulatePath, defaultProfileImage, priceFormat } = require("@helpers/helper");

const ProductReviewCollection = (data) => {
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
        rating: priceFormat(data.rating),
        review: data.review,
        user_name: data.user ? data.user.name : '',
        created_at: formatDateTime(data.createdAt, 8),
        user_image: data.user && (!isEmpty(data.user.profile_image)) ? getFileAbsulatePath(data.user.profile_image) : defaultProfileImage(),
    }
}

module.exports = {
    ProductReviewCollection
}
