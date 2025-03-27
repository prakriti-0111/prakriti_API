const { formatResponse, formatErrorResponse, errorCodes } = require("@utils/response.config");
const db = require("@models");
const { Op, QueryTypes } = require("sequelize");
const { getFileAbsulatePath, isEmpty, logoImage } = require("@helpers/helper");
const { getNextUserName, sendEmail } = require("@library/common");
const moment = require('moment');
const dbSequelize = db.sequelize;
const UserModel = db.users;
const BannerModel = db.banners;
const PromocodeModel = db.promocodes;
const ProductModel = db.products;
const SubscriberModel = db.subscribers;
const stateModel = db.states;
const CategoryModel = db.categories;
const SubCategoryModel = db.sub_categories;
const {BannerCollection} = require("@resources/superadmin/BannerCollection");
const {PromocodeCollection} = require("@resources/customer/PromocodeCollection");

/**
 * Customer Dashboard
 *
 * @param req
 * @param res
 */
exports.index = async (req, res) => {
    const user = await UserModel.findOne({
        where: { id: req.userId
        }
    });

    res.send(formatResponse(UserCollection(user), "Dashboard"));
}

/**
 * Banners
 *
 * @param req
 * @param res
 */
exports.banners = async (req, res) => {
    BannerModel.findAll({
        order:[['id', 'DESC']]
    }).then(async (data) => {
        let result = {
            items: BannerCollection(data),
            total: data.length
        }
        res.send(formatResponse(result));
    })
    .catch(err => {
        res.status(errorCodes.default).send(formatErrorResponse(errorCodes.defaultErrorMsg));
    });

}

/**
 * Promocodes
 *
 * @param req
 * @param res
 */
 exports.promocodes = async (req, res) => {
    PromocodeModel.findAll({
        order:[['discount', 'DESC']],
        where: {status: true},
        include: [
            {
              model: CategoryModel,
              as: 'category',
              required: true
            },
            {
              model: SubCategoryModel,
              as: 'sub_category'
            }
        ]
    }).then(async (data) => {
        let result = {
            items: PromocodeCollection(data),
            total: data.length
        }
        res.send(formatResponse(result));
    })
    .catch(err => {
        res.status(errorCodes.default).send(formatErrorResponse(errorCodes.defaultErrorMsg));
    });

}

/**
 * Best Retailers
 *
 * @param req
 * @param res
 */
exports.bestRetailers = async (req, res) => {
    let query = "SELECT users.profile_image, users.name, users.city, users.state_id, users.created_at, SUM(sales.bill_amount) AS total_amount FROM sales INNER JOIN users ON (users.id = sales.id) WHERE users.role_id = 5 AND sales.is_approved != 2 AND users.deleted_at IS NULL AND sales.deleted_at IS NULL GROUP BY users.id ORDER BY total_amount DESC LIMIT 5";
    const users = await dbSequelize.query(query, { type: QueryTypes.SELECT });
    let retailers = [];
    for(let item of users){
        let state = await stateModel.findOne({where: {id: item.state_id}});
        let address = [];
        if(item.city){
            address.push(item.city);
        }
        if(state){
            address.push(state.name);
        }
        retailers.push({
            name: item.name,
            since: 1990,
            address: address.join(", "),
            image: (!isEmpty(item.profile_image)) ? getFileAbsulatePath(item.profile_image) : logoImage()
        })
    }
    res.send(formatResponse(retailers));
}

/**
 * Counts
 *
 * @param req
 * @param res
 */
exports.counts = async (req, res) => {
    let products = await ProductModel.count();
    let retailers = 200;
    let team_members = 100;
    res.send(formatResponse({
        products: products,
        retailers: retailers,
        team_members: team_members
    }));
}

/**
 * Get Next User name
 *
 * @param req
 * @param res
 */
exports.nextUserName = async (req, res) => {
    let id = req.query.id || '';
    let name = await getNextUserName("retailer", id);
    res.send(formatResponse(name));
}

/**
 * Events
 *
 * @param req
 * @param res
 */
exports.events = async (req, res) => {
    let events = [
        {
            name: "Diwali"
        },
        {
            name: "Navratri and Durga Pooja"
        },
        {
            name: "Dussehra"
        },
        {
            name: "Holi"
        },
        {
            name: "Krishna Janmashtami"
        },
        {
            name: "Onam"
        },
        {
            name: "Ganesh Chaturthi"
        },
        {
            name: "Eid-Ul-Fitr"
        }
    ];
    res.send(formatResponse(events));
}

/**
 * subscribers Store
 *
 * @param req
 * @param res
 */
exports.subscribersStore = async (req, res) => {
    let data = req.body, sub = null;
    if(!isEmpty(data.email)){
        sub = await SubscriberModel.findOne({where: {email: data.email}});
    }else{
        sub = await SubscriberModel.findOne({where: {mobile: data.mobile}});
    }
    let date = null;
    try {
        date = data.date ? moment(data.date).format('YYYY-MM-DD') : '';
    } catch (error) {}

    if(sub){
        if(!('name' in data) || isEmpty(data.name)){
            return res.send(formatResponse("", "Subscribed Successfuly."));
        }
        await SubscriberModel.update({
            email: data.email,
            name: data.name,
            mobile: data.mobile,
            date: date,
            event: data.event
        }, { where: { id: sub.id} });
    }else{
        await SubscriberModel.create({
            email: data.email || null,
            name: data.name || null,
            mobile: data.mobile || null,
            date: date || null,
            event: data.event || null
        });
    }
    res.send(formatResponse("", "Saved Successfuly."));
    
}

/**
 * retailer request
 *
 * @param req
 * @param res
 */
exports.retailerRequest = async (req, res) => {
    let data = req.body;
    let message = `
        <h2>New Retailer Request:</h2>
        <h5>Name: <b>${data.name}</b></h5>
        <h5>Mobile: <b>${data.mobile}</b></h5>
        <h5>Notes: <b>${data.notes}</b></h5>
    `;
    try {
        let result = await sendEmail({to: "ratanvihar@gmail.com", subject: 'New Retailer Request', message: message});
        if(!result){
            return res.status(errorCodes.default).send(formatErrorResponse(errorCodes.defaultErrorMsg));
        }
    } catch (error) {
        //return res.status(errorCodes.default).send(formatErrorResponse(errorCodes.defaultErrorMsg));
    }

    res.send(formatResponse("", "Request Sent Successfuly."));
}




