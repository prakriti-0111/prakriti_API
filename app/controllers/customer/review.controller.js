const config = require("@config/auth.config");
const { errorCodes, formatErrorResponse, formatResponse } = require("@utils/response.config");
const db = require("@models");
const { getPaginationOptions } = require('@helpers/paginator');
const ProductReviewModel = db.product_reviews;
const {ProductReviewCollection} = require("@resources/customer/ProductReviewCollection");
const { updateProductAvgReview } = require("@library/common");
const userModel = db.users;

/**
 * Retailer My Review
 * 
 * @param {*} req
 * @param {*} res 
 */
exports.index = async (req, res) => {
    let { page, limit, product_id } = req.query;
    const paginatorOptions = getPaginationOptions(page, limit);
    ProductReviewModel.findAndCountAll({ 
        where: { product_id: product_id},
        order:[['id', 'DESC']],
        offset: paginatorOptions.offset,
        limit: paginatorOptions.limit,
        include: [
            {
                model: userModel,
                as: 'user',
            }
        ]
    }).then(async (data) => {
        let result = {
            items: ProductReviewCollection(data.rows),
            total: data.count
        }
        if(page == 1){
            let total_5 = await ProductReviewModel.count({where: {product_id: product_id, rating: 5}});
            let total_4 = await ProductReviewModel.count({where: {product_id: product_id, rating: 4}});
            let total_3 = await ProductReviewModel.count({where: {product_id: product_id, rating: 3}});
            let total_2 = await ProductReviewModel.count({where: {product_id: product_id, rating: 2}});
            total_5 = data.count > 0 ? (100 * total_5 / data.count).toFixed(0) : 0;
            total_4 = data.count > 0 ? (100 * total_4 / data.count).toFixed(0) : 0;
            total_3 = data.count > 0 ? (100 * total_3 / data.count).toFixed(0) : 0;
            total_2 = data.count > 0 ? (100 * total_2 / data.count).toFixed(0) : 0;
            result = {...result, ...{
                total_5: total_5,
                total_4: total_4,
                total_3: total_3,
                total_2: total_2
            }}
        }
        res.send(formatResponse(result));
    })
    .catch(err => { 
        res.status(errorCodes.default).send(formatErrorResponse(errorCodes.defaultErrorMsg));
    });
  
}
  
/**
 * Create Review
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.store = async (req, res) => {
    let data = req.body;
    let postData = {
        user_id: req.userId,
        product_id: data.product_id,
        review: data.review,
        rating: data.rating
    }
    ProductReviewModel.create(postData).then(async(result) => {
        await updateProductAvgReview(data.product_id);

        res.send(formatResponse("", "Review successfully!"));
    }).catch(error => {
        return res.status(errorCodes.default).send(formatErrorResponse(errorCodes.defaultErrorMsg));
    }); 

}