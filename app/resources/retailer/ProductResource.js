const { isObject, isEmpty, getFileAbsulatePath, isArray, productTypeDisplay } = require("@helpers/helper");
const {ProductSizeCollection} = require("@resources/retailer/ProductSizeCollection");
const {ProductMaterialCollection} = require("@resources/retailer/ProductMaterialCollection");
//const {StocksCollection} = require("@resources/retailer/StocksCollection");

const ProductResource = (data) => {
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
    let images = [];
    let default_image = '';
    if(isArray(data.images)){
        for(let i = 0; i < data.images.length; i++){
            images.push({
                file_name: data.images[i].file_name,
                path: getFileAbsulatePath(data.images[i].path),
            })

            if(i == 0){
                default_image = getFileAbsulatePath(data.images[i].path);
            }
        }
    }
    let video = '';
    if(!isEmpty(data.video)){
        video = getFileAbsulatePath(data.video);
    }


    let all_materials =  ProductMaterialCollection(data.materials);
    let sizes = (data.type != 'material' ) ? ProductSizeCollection(data.sizes): [];
    //let stocks = StocksCollection(data.stocks);
    let materials = (data.type == 'material') ? all_materials: [];
    let purities = [];

    /*all_materials.forEach(material => {
          if(!isEmpty(material) && material.purities.length > 0){
            purities = material.purities;
          }
    });*/

    return {
        id: data.id,
        category_id: data.category_id,
        sub_category_id: data.sub_category_id,
        name: data.name,
        slug: !isEmpty(data.slug) ? data.slug : '',
        certificate: data.certificate ? data.certificate.name : '',
        category: data.category ? data.category.name : '',
        sub_category: data.sub_category ? data.sub_category.name : '',
        tax_rate_id: !isEmpty(data.tax_rate_id) ? data.tax_rate_id : '',
        product_code: data.product_code,
        certificate_id: !isEmpty(data.certificate_id) ? data.certificate_id : '',
        description: !isEmpty(data.description) ? data.description : '',
        type: data.type,
        type_diplay: productTypeDisplay(data.type),
        description: !isEmpty(data.description) ? data.description : '',
        licence_no: !isEmpty(data.licence_no) ? data.licence_no : '',
        status: data.status,
        default_image: default_image,
        images: images,
        video: video,
        sizes: sizes,
        materials: materials,
        all_materials: all_materials
    }
}

module.exports = {
    ProductResource
}
