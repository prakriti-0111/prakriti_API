const { isEmpty } = require("@helpers/helper");
let defaultMessage = "The given data was invalid."
const formatValidationResponse = (err, isObj) => {
  if(isObj === true){
    return formatErrorResponse(err.errors);
  }else{
    return formatErrorResponse(validationErrorsToString(err.errors));
  }
}

const formatResponse = (data, message) => {
  return {
    success: true,
    data: data || [],
    message: message || "",
  }
}

const formatErrorResponse = (message) => {
  return {
    success: false,
    message: message === undefined ? errorCodes.defaultErrorMsg : message
  }
}

const validationErrorsToString = (erros) => {
  let errosArr = [];
  for (const [key, value] of Object.entries(erros)) {
    let errStr = value[0];
    errosArr.push(errStr);
  }
  if(errosArr.length){
    errosArr = errosArr.join('; ');
  }
  return errosArr;
}

const errorCodes = {
  auth: 403,
  default: 200,
  defaultErrorMsg: "Something went wrong"
};


module.exports = {
  formatValidationResponse,
  formatResponse,
  formatErrorResponse,
  errorCodes
}