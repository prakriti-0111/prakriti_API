const { errorCodes, formatErrorResponse, formatResponse } = require("@utils/response.config");
const { getPaginationOptions } = require('@helpers/paginator');
const { isEmpty } = require("@helpers/helper");
const db = require("@models");
const { Op } = require("sequelize");
const {updateOrCreate} = require("@library/common");
const {DistrictCollection} = require("@resources/superadmin/DistrictCollection");
const DistrictModel = db.districts;
const StateModel = db.states;
const CountryModel = db.countries;

/**
 * Retrieve all districts
 * @param req
 * @param res
 */
exports.index = async (req, res) => {
    let { page, limit, all, state_id, country_id, search } = req.query;
    let conditions = {};
    if(!isEmpty(search)){
      conditions.name = {[Op.like]: `%${search}%` };
    }
    if(!isEmpty(state_id)){
      conditions.state_id = state_id;
    }
    if(!isEmpty(country_id)){
      conditions.country_id = country_id;
    }

    if(all == 1){
      DistrictModel.findAll({
        order:[['id', 'ASC']],
        where: conditions
      }).then(async (data) => {
        let result = {
          items: DistrictCollection(data),
          total: data.length
        }
        res.send(formatResponse(result, 'Districts'));
      })
      .catch(err => {
        res.status(errorCodes.default).send(formatErrorResponse(err));
      });
    }
    else{
      const paginatorOptions = getPaginationOptions(page, limit);
      DistrictModel.findAndCountAll({
        order:[['id', 'DESC']],
        offset: paginatorOptions.offset,
        limit: paginatorOptions.limit,
        include: [
          {
            model: CountryModel,
            as: 'country',
          },
          
          {
            model: StateModel,
            as: 'state',
          }
        ],
        where: conditions
      }).then(async (data) => {
          let result = {
            items: DistrictCollection(data.rows),
            total: data.count,
          }
          res.send(formatResponse(result, 'Districts'));
        })
        .catch(err => {
          res.status(errorCodes.default).send(formatErrorResponse(err));
        });
      };
    }

/**
 * Create District
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.store = async (req, res) => {
    let data = req.body;
  
    const postData = {
      name: data.name,
      country_id: data.country_id,
      state_id: data.state_id
    };
  
    DistrictModel.create(postData).then(result => {
      res.send(formatResponse(DistrictCollection(result), "District created successfully!"));
    }).catch(error => {
      return res.status(errorCodes.default).send(formatErrorResponse('District does not created due to some error' + error));
    }); 
};


/**
 * Update District
 * 
 * @param {*} req 
 * @param {*} res 
 */
 exports.update = async (req, res) => {
    let data = req.body;
    let state = await DistrictModel.findOne({ where: { id: req.params.id} });
    if (!state) {
      return res.status(errorCodes.default).send(formatErrorResponse('District not found'));
    }
    const postData = {
      name: data.name,
      country_id: data.country_id,
      state_id: data.state_id
    };
    DistrictModel.update(postData, { where: { id: req.params.id} }).then(result => {
      res.send(formatResponse(DistrictCollection(data), "District updated successfully!"));
    }).catch(error => {
      return res.status(errorCodes.default).send(formatErrorResponse('District does not updated due to some error' + error));
    });
};


/**
 * View District
 * 
 * @param {*} req 
 * @param {*} res 
 */
 exports.fetch = async (req, res) => {
  let state = await DistrictModel.findOne({ where: { id: req.params.id} ,
  
  include: [
      {
        model: CountryModel,
        as: 'country',
      },
      
      {
        model: StateModel,
        as: 'state',
      }
    ]});
  if (!state) {
    return res.status(errorCodes.default).send(formatErrorResponse('District not found'));
  }
  res.send(formatResponse(DistrictCollection(state), "District fetched successfully!"));
};
  

/**
 * delete District
 * 
 * @param {*} req
 * @param {*} res 
 */
 exports.delete = async (req, res) => {
    DistrictModel.destroy({ where: { id: req.params.id} }).then(result => {
      res.send(formatResponse("", 'District deleted Successfully!'));
    }).catch(error => {
      return res.status(errorCodes.default).send(formatErrorResponse(error));
    });
};

/**
 * generate default Districts
 * 
 * @param {*} req
 * @param {*} res 
 */
exports.generateDefaultDistricts = async (req, res) => {
  let allStates = {};
  allStates.AndraPradesh = ["Anantapur","Chittoor","East Godavari","Guntur","Kadapa","Krishna","Kurnool","Prakasam","Nellore","Srikakulam","Visakhapatnam","Vizianagaram","West Godavari"];
  allStates.ArunachalPradesh = ["Anjaw","Changlang","Dibang Valley","East Kameng","East Siang","Kra Daadi","Kurung Kumey","Lohit","Longding","Lower Dibang Valley","Lower Subansiri","Namsai","Papum Pare","Siang","Tawang","Tirap","Upper Siang","Upper Subansiri","West Kameng","West Siang","Itanagar"];
  allStates.Assam = ["Baksa","Barpeta","Biswanath","Bongaigaon","Cachar","Charaideo","Chirang","Darrang","Dhemaji","Dhubri","Dibrugarh","Goalpara","Golaghat","Hailakandi","Hojai","Jorhat","Kamrup Metropolitan","Kamrup (Rural)","Karbi Anglong","Karimganj","Kokrajhar","Lakhimpur","Majuli","Morigaon","Nagaon","Nalbari","Dima Hasao","Sivasagar","Sonitpur","South Salmara Mankachar","Tinsukia","Udalguri","West Karbi Anglong"];
  allStates.Bihar = ["Araria","Arwal","Aurangabad","Banka","Begusarai","Bhagalpur","Bhojpur","Buxar","Darbhanga","East Champaran","Gaya","Gopalganj","Jamui","Jehanabad","Kaimur","Katihar","Khagaria","Kishanganj","Lakhisarai","Madhepura","Madhubani","Munger","Muzaffarpur","Nalanda","Nawada","Patna","Purnia","Rohtas","Saharsa","Samastipur","Saran","Sheikhpura","Sheohar","Sitamarhi","Siwan","Supaul","Vaishali","West Champaran"];
  allStates.Chhattisgarh = ["Balod","Baloda Bazar","Balrampur","Bastar","Bemetara","Bijapur","Bilaspur","Dantewada","Dhamtari","Durg","Gariaband","Janjgir Champa","Jashpur","Kabirdham","Kanker","Kondagaon","Korba","Koriya","Mahasamund","Mungeli","Narayanpur","Raigarh","Raipur","Rajnandgaon","Sukma","Surajpur","Surguja"];
  allStates.Goa = ["North Goa","South Goa"];
  allStates.Gujarat = ["Ahmedabad","Amreli","Anand","Aravalli","Banaskantha","Bharuch","Bhavnagar","Botad","Chhota Udaipur","Dahod","Dang","Devbhoomi Dwarka","Gandhinagar","Gir Somnath","Jamnagar","Junagadh","Kheda","Kutch","Mahisagar","Mehsana","Morbi","Narmada","Navsari","Panchmahal","Patan","Porbandar","Rajkot","Sabarkantha","Surat","Surendranagar","Tapi","Vadodara","Valsad"];
  allStates.Haryana = ["Ambala","Bhiwani","Charkhi Dadri","Faridabad","Fatehabad","Gurugram","Hisar","Jhajjar","Jind","Kaithal","Karnal","Kurukshetra","Mahendragarh","Mewat","Palwal","Panchkula","Panipat","Rewari","Rohtak","Sirsa","Sonipat","Yamunanagar"];
  allStates.HimachalPradesh = ["Bilaspur","Chamba","Hamirpur","Kangra","Kinnaur","Kullu","Lahaul Spiti","Mandi","Shimla","Sirmaur","Solan","Una"];
  allStates.JammuKashmir = ["Anantnag","Bandipora","Baramulla","Budgam","Doda","Ganderbal","Jammu","Kargil","Kathua","Kishtwar","Kulgam","Kupwara","Leh","Poonch","Pulwama","Rajouri","Ramban","Reasi","Samba","Shopian","Srinagar","Udhampur"];
  allStates.Jharkhand = ["Bokaro","Chatra","Deoghar","Dhanbad","Dumka","East Singhbhum","Garhwa","Giridih","Godda","Gumla","Hazaribagh","Jamtara","Khunti","Koderma","Latehar","Lohardaga","Pakur","Palamu","Ramgarh","Ranchi","Sahebganj","Seraikela Kharsawan","Simdega","West Singhbhum"];
  allStates.Karnataka = ["Bagalkot","Bangalore Rural","Bangalore Urban","Belgaum","Bellary","Bidar","Vijayapura","Chamarajanagar","Chikkaballapur","Chikkamagaluru","Chitradurga","Dakshina Kannada","Davanagere","Dharwad","Gadag","Gulbarga","Hassan","Haveri","Kodagu","Kolar","Koppal","Mandya","Mysore","Raichur","Ramanagara","Shimoga","Tumkur","Udupi","Uttara Kannada","Yadgir"];
  allStates.Kerala = ["Alappuzha","Ernakulam","Idukki","Kannur","Kasaragod","Kollam","Kottayam","Kozhikode","Malappuram","Palakkad","Pathanamthitta","Thiruvananthapuram","Thrissur","Wayanad"];
  allStates.MadhyaPradesh = ["Agar Malwa","Alirajpur","Anuppur","Ashoknagar","Balaghat","Barwani","Betul","Bhind","Bhopal","Burhanpur","Chhatarpur","Chhindwara","Damoh","Datia","Dewas","Dhar","Dindori","Guna","Gwalior","Harda","Hoshangabad","Indore","Jabalpur","Jhabua","Katni","Khandwa","Khargone","Mandla","Mandsaur","Morena","Narsinghpur","Neemuch","Panna","Raisen","Rajgarh","Ratlam","Rewa","Sagar","Satna",
  "Sehore","Seoni","Shahdol","Shajapur","Sheopur","Shivpuri","Sidhi","Singrauli","Tikamgarh","Ujjain","Umaria","Vidisha"];
  allStates.Maharashtra = ["Ahmednagar","Akola","Amravati","Aurangabad","Beed","Bhandara","Buldhana","Chandrapur","Dhule","Gadchiroli","Gondia","Hingoli","Jalgaon","Jalna","Kolhapur","Latur","Mumbai City","Mumbai Suburban","Nagpur","Nanded","Nandurbar","Nashik","Osmanabad","Palghar","Parbhani","Pune","Raigad","Ratnagiri","Sangli","Satara","Sindhudurg","Solapur","Thane","Wardha","Washim","Yavatmal"];
  allStates.Manipur = ["Bishnupur","Chandel","Churachandpur","Imphal East","Imphal West","Jiribam","Kakching","Kamjong","Kangpokpi","Noney","Pherzawl","Senapati","Tamenglong","Tengnoupal","Thoubal","Ukhrul"];
  allStates.Meghalaya = ["East Garo Hills","East Jaintia Hills","East Khasi Hills","North Garo Hills","Ri Bhoi","South Garo Hills","South West Garo Hills","South West Khasi Hills","West Garo Hills","West Jaintia Hills","West Khasi Hills"];
  allStates.Mizoram = ["Aizawl","Champhai","Kolasib","Lawngtlai","Lunglei","Mamit","Saiha","Serchhip","Aizawl","Champhai","Kolasib","Lawngtlai","Lunglei","Mamit","Saiha","Serchhip"];
  allStates.Nagaland = ["Dimapur","Kiphire","Kohima","Longleng","Mokokchung","Mon","Peren","Phek","Tuensang","Wokha","Zunheboto"];
  allStates.Odisha = ["Angul","Balangir","Balasore","Bargarh","Bhadrak","Boudh","Cuttack","Debagarh","Dhenkanal","Gajapati","Ganjam","Jagatsinghpur","Jajpur","Jharsuguda","Kalahandi","Kandhamal","Kendrapara","Kendujhar","Khordha","Koraput","Malkangiri","Mayurbhanj","Nabarangpur","Nayagarh","Nuapada","Puri","Rayagada","Sambalpur","Subarnapur","Sundergarh"];
  allStates.Punjab = ["Amritsar","Barnala","Bathinda","Faridkot","Fatehgarh Sahib","Fazilka","Firozpur","Gurdaspur","Hoshiarpur","Jalandhar","Kapurthala","Ludhiana","Mansa","Moga","Mohali","Muktsar","Pathankot","Patiala","Rupnagar","Sangrur","Shaheed Bhagat Singh Nagar","Tarn Taran"];
  allStates.Rajasthan = ["Ajmer","Alwar","Banswara","Baran","Barmer","Bharatpur","Bhilwara","Bikaner","Bundi","Chittorgarh","Churu","Dausa","Dholpur","Dungarpur","Ganganagar","Hanumangarh","Jaipur","Jaisalmer","Jalore","Jhalawar","Jhunjhunu","Jodhpur","Karauli","Kota","Nagaur","Pali","Pratapgarh","Rajsamand","Sawai Madhopur","Sikar","Sirohi","Tonk","Udaipur"];
  allStates.Sikkim = ["East Sikkim","North Sikkim","South Sikkim","West Sikkim"];
  allStates.TamilNadu = ["Ariyalur","Chennai","Coimbatore","Cuddalore","Dharmapuri","Dindigul","Erode","Kanchipuram","Kanyakumari","Karur","Krishnagiri","Madurai","Nagapattinam","Namakkal","Nilgiris","Perambalur","Pudukkottai","Ramanathapuram","Salem","Sivaganga","Thanjavur","Theni","Thoothukudi","Tiruchirappalli","Tirunelveli","Tiruppur","Tiruvallur","Tiruvannamalai","Tiruvarur","Vellore","Viluppuram","Virudhunagar"];
  allStates.Telangana = ["Adilabad","Bhadradri Kothagudem","Hyderabad","Jagtial","Jangaon","Jayashankar","Jogulamba","Kamareddy","Karimnagar","Khammam","Komaram Bheem","Mahabubabad","Mahbubnagar","Mancherial","Medak","Medchal","Nagarkurnool","Nalgonda","Nirmal","Nizamabad","Peddapalli","Rajanna Sircilla","Ranga Reddy","Sangareddy","Siddipet","Suryapet","Vikarabad","Wanaparthy","Warangal Rural","Warangal Urban","Yadadri Bhuvanagiri"];
  allStates.Tripura = ["Dhalai","Gomati","Khowai","North Tripura","Sepahijala","South Tripura","Unakoti","West Tripura"];
  allStates.UttarPradesh = ["Agra","Aligarh","Allahabad","Ambedkar Nagar","Amethi","Amroha","Auraiya","Azamgarh","Baghpat","Bahraich","Ballia","Balrampur","Banda","Barabanki","Bareilly","Basti","Bhadohi","Bijnor","Budaun","Bulandshahr","Chandauli","Chitrakoot","Deoria","Etah","Etawah","Faizabad","Farrukhabad","Fatehpur","Firozabad","Gautam Buddha Nagar","Ghaziabad","Ghazipur","Gonda","Gorakhpur","Hamirpur","Hapur","Hardoi","Hathras","Jalaun","Jaunpur","Jhansi","Kannauj","Kanpur Dehat","Kanpur Nagar","Kasganj","Kaushambi","Kheri","Kushinagar","Lalitpur","Lucknow","Maharajganj","Mahoba","Mainpuri","Mathura","Mau","Meerut","Mirzapur","Moradabad","Muzaffarnagar","Pilibhit","Pratapgarh","Raebareli","Rampur","Saharanpur","Sambhal","Sant Kabir Nagar","Shahjahanpur","Shamli","Shravasti","Siddharthnagar","Sitapur","Sonbhadra","Sultanpur","Unnao","Varanasi"];
  allStates.Uttarakhand  = ["Almora","Bageshwar","Chamoli","Champawat","Dehradun","Haridwar","Nainital","Pauri","Pithoragarh","Rudraprayag","Tehri","Udham Singh Nagar","Uttarkashi"];
  allStates.WestBengal = ["Alipurduar","Bankura","Birbhum","Cooch Behar","Dakshin Dinajpur","Darjeeling","Hooghly","Howrah","Jalpaiguri","Jhargram","Kalimpong","Kolkata","Malda","Murshidabad","Nadia","North 24 Parganas","Paschim Bardhaman","Paschim Medinipur","Purba Bardhaman","Purba Medinipur","Purulia","South 24 Parganas","Uttar Dinajpur"];
  allStates.AndamanNicobar = ["Nicobar","North Middle Andaman","South Andaman"];
  allStates.Chandigarh = ["Chandigarh"];
  allStates.DadraHaveli = ["Dadra Nagar Haveli"];
  allStates.DamanDiu = ["Daman","Diu"];
  allStates.Delhi = ["Central Delhi","East Delhi","New Delhi","North Delhi","North East Delhi","North West Delhi","Shahdara","South Delhi","South East Delhi","South West Delhi","West Delhi"];
  allStates.Lakshadweep = ["Lakshadweep"];
  allStates.Puducherry = ["Karaikal","Mahe","Puducherry","Yanam"];

  let i = 0;
  let originalStateNames = {
    'AndraPradesh' : 'Andhra Pradesh',
    'ArunachalPradesh' : 'Arunachal Pradesh',
    'HimachalPradesh' : "Himachal Pradesh",
    'JammuKashmir' : "Jammu and Kashmir",
    'MadhyaPradesh' : "Madhya Pradesh",
    'TamilNadu' : "Tamil Nadu",
    'UttarPradesh' : "Uttar Pradesh",
    'WestBengal' : "West Bengal",
    'AndamanNicobar' : "Andaman and Nicobar Islands",
    'DadraHaveli' : "Dadra and Nagar Haveli",
    'DamanDiu' : "Daman and Diu"
  }
  let arr = [];
  for (var key of Object.keys(allStates)) {
    let name = key in originalStateNames ? originalStateNames[key] : key;
    let state = await StateModel.findOne({where: {name: name}});
    if(state){
      for (let dis of allStates[key]) {
        let obj = {
          country_id: 1,
          state_id: state.id,
          name: dis
        };

        await updateOrCreate(DistrictModel, obj, obj);
      }
      
    }
  }

}