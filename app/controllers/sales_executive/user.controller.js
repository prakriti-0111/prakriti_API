const config = require("@config/auth.config");
const db = require("@models");
const { errorCodes, formatErrorResponse, formatResponse } = require("@utils/response.config");
const { getRoleId,getUserColumnValue } = require("@library/common");
const {RetailerCollection} = require("@resources/sales_executive/RetailerCollection");
const UserModel = db.users;
const countryModel = db.countries;
const stateModel = db.states;
const districtModel = db.districts;



exports.getRetailer = async (req, res) => {
  let RetailerRoleId = getRoleId('retailer');
let district_id = await getUserColumnValue(req.userId, 'district_id');
    UserModel.findAll({ 
        where: { role_id: RetailerRoleId, district_id: district_id },
        order:[['id', 'ASC']],
        include: [
          {
            model: stateModel,
            as: 'state',
          },
          {
            model: countryModel,
            as: 'country',
          },
          {
            model: districtModel,
            as: 'district',
          }
      ]
      }).then(async (data) => {
        let result = {
          items: RetailerCollection(data),
          total: data.length,
        }
        res.send(formatResponse(result, 'Retailers'));
      })
      .catch(err => { 
        res.status(errorCodes.default).send(formatErrorResponse(err));
      });
    };