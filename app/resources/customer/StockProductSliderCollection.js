const { isObject, getFileAbsulatePath, isEmpty, arrayColumn, formatDateTime, priceFormat, displayAmount } = require("@helpers/helper");

const StockProductSliderCollection = (data) => {
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
    // if(data.discount_type == "flat"){
    //     discount_display = displayAmount(data.discount, false, true, false);
    // }else{
    //     discount_display = priceFormat(data.discount, true) + '%';
    // }
    discount_display = displayAmount(data.discount, false, true, false);

    return {
        id: data.id,
        title: data.title,
        description: data.description || '',
        category_id: data.category_id,
        sub_category_id: data.sub_category_id,
        price: data.price,
        discount: data.discount,
        final_price: data.final_price,
        button_txt: data.button_txt || '',
        banner: !isEmpty(data.banner) ? getFileAbsulatePath(data.banner) : '',
        products: data.products,
        status: data.status,
        discount_display: discount_display,
        category_slug: data.category.slug,
        sub_category_slug: data.sub_category ? data.sub_category.slug : ''

    }
}

module.exports = {
    StockProductSliderCollection
}
