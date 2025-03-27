const { isObject, isEmpty, displayAmount, getFileAbsulatePath, isArray } = require("@helpers/helper");
const {getProductPrices} = require("@library/common");
const {CartMaterialCollection} = require("@resources/retailer/CartMaterialCollection");


const CheckoutCollection = (data) => {
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
    let cartMaterial = !isEmpty(data.cartMaterial) ? CartMaterialCollection(data.cartMaterial) : {};
    let material_price = {};
    let price = '';
    let total = '';
    let discount = '';
    let default_image = '';
    let quantity = data.quantity;

    if(!isEmpty(data.product) && isArray(data.product.images)){
        if(data.product.images.length > 0){
            default_image = getFileAbsulatePath(data.product.images[0].path);
        }
    }

    if(!isEmpty(data.cartMaterial) && !isEmpty(data.cartMaterial.material)){
        let priceData = getProductPrices(data.cartMaterial.material, quantity);
        price = priceData.price;
        sale_price = priceData.sale_price;
        discount = priceData.discount;
    }
   
    return {        
        id: data.id,
        product_id: data.product_id,
        user_id: data.user_id,
        size_id: !isEmpty(data.size_id) ? data.size_id : '',
        stock_id: !isEmpty(data.stock_id) ? data.stock_id : '',
        price: !isEmpty(price) ? displayAmount(price, false, false) : '',
        total: !isEmpty(total) ? displayAmount(total, false, false) : '',
        discount: !isEmpty(discount) ? displayAmount(discount, false, false) : '',
        display_price: !isEmpty(price) ? displayAmount(price) : '',
        display_total: !isEmpty(total) ? displayAmount(total) : '',
        display_discount: !isEmpty(discount) ? displayAmount(discount) : '',
        size_name: !isEmpty(data.size) ? data.size.name : '',
        product_name: !isEmpty(data.product) ? data.product.name : '',
        default_image: default_image,
        quantity: quantity,
        cartMaterial: cartMaterial
    }
}

module.exports = {
    CheckoutCollection
}
