const { isObject, isEmpty, getFileAbsulatePath, isArray, displayAmount, getDiscountedText } = require("@helpers/helper");
const {getProductPrices} = require("@library/common");
const {ProductMaterialCollection} = require("@resources/retailer/ProductMaterialCollection");

const WishlistCollection = (data) => {
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

    let default_image = '';
    if(!isEmpty(data.product) && !isEmpty(data.product.images) && isArray(data.product.images)){
        for(let i = 0; i < data.product.images.length; i++){
            if(i == 0){
                default_image = getFileAbsulatePath(data.product.images[i].path);
                break;
            }
        }
    }

    let price = '';
    let sale_price = '';
    let discount = '';
    let off_discount = '';

    let all_materials = [];
    let materials = [];


    if( !isEmpty(data.product) && !isEmpty(data.product.materials)){
        if(data.product.materials.length > 0){
            let priceData = getProductPrices(data.product.materials[0], 1);
            price = priceData.price;
            sale_price = priceData.sale_price;
            discount = priceData.discount;
            off_discount = priceData.off_discount;
        }

        all_materials =  ProductMaterialCollection(data.product.materials);
        materials = (data.product.type == 'material') ? all_materials: [];
    }

   

    return {
        id: data.id,
        product_id: data.product_id,
        size_id: !isEmpty(data.size_id) ? data.size_id : '',
        product_name: !isEmpty(data.product) ? data.product.name : '',
        product_code: !isEmpty(data.product) ? data.product.product_code : '',
        size:  !isEmpty(data.size) ? data.size.name : '',
        quantity: 1,
        default_image: default_image,
        price: !isEmpty(price) ? displayAmount(price, false, false) : '',
        sale_price: !isEmpty(sale_price) ? displayAmount(sale_price, false, false) : '',
        discount: !isEmpty(discount) ? displayAmount(discount, false, false) : '',
        display_price: !isEmpty(price) ? displayAmount(price) : '',
        display_sale_price: !isEmpty(sale_price) ? displayAmount(sale_price) : '',
        display_discount: !isEmpty(off_discount) ? getDiscountedText(off_discount, 'percent') : '',
        all_materials: all_materials,
        materials: materials,
    }
}

module.exports = {
    WishlistCollection
}
