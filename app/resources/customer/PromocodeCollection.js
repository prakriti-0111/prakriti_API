const { isObject, getFileAbsulatePath, isEmpty, arrayColumn, formatDateTime, priceFormat, displayAmount } = require("@helpers/helper");

const PromocodeCollection = (data) => {
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
    let discount_display = '';
    if(data.discount_type == "flat"){
        discount_display = displayAmount(data.discount, false, true, false);
    }else{
        discount_display = priceFormat(data.discount, true) + '%';
    }

    return {
        id: data.id,
        title: data.title,
        description: data.description || '',
        category_id: data.category_id,
        sub_category_id: data.sub_category_id,
        discount: data.discount,
        discount_type: data.discount_type,
        code: data.code,
        start_date: formatDateTime(data.start_date, 8),
        end_date: formatDateTime(data.end_date, 8),
        banner: !isEmpty(data.banner) ? getFileAbsulatePath(data.banner) : '',
        products: data.products,
        status: data.status,
        discount_display: discount_display,
        category_slug: data.category.slug,
        sub_category_slug: data.sub_category ? data.sub_category.slug : ''

    }
}

module.exports = {
    PromocodeCollection
}
