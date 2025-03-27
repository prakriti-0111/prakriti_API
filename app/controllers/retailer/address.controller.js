const config = require("@config/auth.config");
const { errorCodes, formatErrorResponse, formatResponse } = require("@utils/response.config");
const db = require("@models");
const { getPaginationOptions } = require('@helpers/paginator')
const { isEmpty } = require("@helpers/helper");
const {AddressCollection} = require("@resources/retailer/AddressCollection");
const {CountryCollection} = require("@resources/superadmin/CountryCollection");
const {StateCollection} = require("@resources/superadmin/StateCollection");
const {DistrictCollection} = require("@resources/superadmin/DistrictCollection");
const AddressModel = db.addresses;
const UserModel = db.users;
const CountryModel = db.countries;
const StateModel = db.states;
const DistrictModel = db.districts;


/**
 * Retrieve all addresses
 * @param req
 * @param res
 */
exports.index = async (req, res) => {
  let { page, limit, all } = req.query;
  if(all == 1){
    AddressModel.findAll({ 
      order:[['id', 'ASC']],
      where: {user_id: req.userId},
      include: [
        {
          model: CountryModel,
          as: 'country'
        },
        {
          model: StateModel,
          as: 'state'
        },
        {
          model: DistrictModel,
          as: 'district'
        }
      ]
    }).then(async (data) => {
      let result = {
        items: AddressCollection(data),
        total: data.length
      }
      res.send(formatResponse(result, 'Addresses'));
    })
    .catch(err => {
      res.status(errorCodes.default).send(formatErrorResponse(err));
    });
  }else{
    const paginatorOptions = getPaginationOptions(page, limit);
    AddressModel.findAndCountAll({ 
        order:[['id', 'ASC']],
        offset: paginatorOptions.offset,
        limit: paginatorOptions.limit,
        where: {user_id: req.userId},
        include: [
          {
            model: CountryModel,
            as: 'country'
          },
          {
            model: StateModel,
            as: 'state'
          },
          {
            model: DistrictModel,
            as: 'district'
          }
        ]
      }).then(async (data) => {
        let result = {
          items: AddressCollection(data.rows),
          total: data.count,
        }
        res.send(formatResponse(result, 'Addresses'));
      })
      .catch(err => {
        res.status(errorCodes.default).send(formatErrorResponse(err));
      });
    };
  }

/**
 * Create addresses
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.store = async (req, res) => {
    let data = req.body;
  
    const postData = {
      user_id: req.userId,
      type: data.type,
      name: data.name,
      street: data.street,
      landmark: data.landmark,
      city: data.city,
      //state: data.state,
      zipcode: data.zipcode,
      //country: data.country,
      contact: data.contact,
      lat: !isEmpty(data.lat) ? data.lat: null,
      lng: !isEmpty(data.lng) ? data.lng: null,
      country_id: !isEmpty(data.country_id) ? data.country_id: null,
      state_id: !isEmpty(data.state_id) ? data.state_id: null,
      district_id: !isEmpty(data.district_id) ? data.district_id: null,
    };
  
    AddressModel.create(postData).then(result => {
      res.send(formatResponse([], "Address created successfully!"));
    }).catch(error => {
      return res.status(errorCodes.default).send(formatErrorResponse('Address does not created due to some error' + error));
    }); 
};


/**
 * View Address
 * 
 * @param {*} req 
 * @param {*} res 
 */
 exports.fetch = async (req, res) => {
  let address = await AddressModel.findOne({ where: { id: req.params.id, user_id: req.userId }, 
    include: [
      {
        model: UserModel,
        as: 'users',
      }
    ], 
  });
  if (!address) {
    return res.status(errorCodes.default).send(formatErrorResponse('Address not found'));
  }
  res.send(formatResponse(AddressCollection(address), "Address fetched successfully!"));
};



/**
 * Update Address
 * 
 * @param {*} req 
 * @param {*} res 
 */
 exports.update = async (req, res) => {
    let data = req.body;
    let address = await AddressModel.findOne({ where: { id: req.params.id } });
    if (!address) {
      return res.status(errorCodes.default).send(formatErrorResponse('Address not found'));
    }
    const postData = {
      user_id: req.userId,
      type: data.type,
      name: data.name,
      street: data.street,
      landmark: data.landmark,
      city: data.city,
      //state: data.state,
      zipcode: data.zipcode,
      //country: data.country,
      contact: data.contact,
      lat: !isEmpty(data.lat) ? data.lat: null,
      lng: !isEmpty(data.lng) ? data.lng: null,
      country_id: !isEmpty(data.country_id) ? data.country_id: null,
      state_id: !isEmpty(data.state_id) ? data.state_id: null,
      district_id: !isEmpty(data.district_id) ? data.district_id: null,
    };
    AddressModel.update(postData, { where: { id: req.params.id } }).then(result => {
      res.send(formatResponse([], "Address updated successfully!"));
    }).catch(error => {
      return res.status(errorCodes.default).send(formatErrorResponse('Address does not updated due to some error' + error));
    });
};



  
/**
 * delete Address
 * 
 * @param {*} req
 * @param {*} res 
 */
exports.delete = async (req, res) => {
    AddressModel.destroy({ where: { id: req.params.id } }).then(result => {
      res.send(formatResponse("", 'Address deleted Successfully!'));
    }).catch(error => {
      return res.status(errorCodes.default).send(formatErrorResponse(error));
    });
};


/**
 * Country list
 * 
 * @param {*} req
 * @param {*} res 
 */
exports.getCountries = async (req, res) => {
  CountryModel.findAll({ 
    order:[['id', 'ASC']]
  }).then(async (data) => {
    res.send(formatResponse(CountryCollection(data), 'Country list'));
  })
  .catch(err => {
    res.status(errorCodes.default).send(formatErrorResponse(err));
  });
}

/**
 * State list
 * 
 * @param {*} req
 * @param {*} res 
 */
exports.getStates = async (req, res) => {
  let {country_id} = req.query;
  let conditions = {};
  if(!isEmpty(country_id)){
    conditions.country_id = country_id;
  }

  StateModel.findAll({ 
    order:[['id', 'ASC']],
    where: conditions
  }).then(async (data) => {
    res.send(formatResponse(StateCollection(data), 'State list'));
  })
  .catch(err => {
    res.status(errorCodes.default).send(formatErrorResponse(err));
  });
}

/**
 * District list
 * 
 * @param {*} req
 * @param {*} res 
 */
exports.getDistricts = async (req, res) => {
  let {state_id} = req.query;
  let conditions = {};
  if(!isEmpty(state_id)){
    conditions.state_id = state_id;
  }

  DistrictModel.findAll({ 
    order:[['id', 'ASC']],
    where: conditions
  }).then(async (data) => {
    res.send(formatResponse(DistrictCollection(data), 'District list'));
  })
  .catch(err => {
    res.status(errorCodes.default).send(formatErrorResponse(err));
  });
}