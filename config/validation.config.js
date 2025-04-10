let defaultMessage = "The given data was invalid."
const formatValidationErrors = (err) => {
  return {
    status: false,
    errors: JSON.stringify(err.errors),
    extra : "validation errors"
  }
}

const formatResponse = (data, message) => {
  return {
    success: true,
    error: true,
    message: defaultMessage,
    errors: JSON.stringify(err.errors),
    data: []
  }
}

const validationConfig = {
  errorCode: 200,
  defaultMessage: defaultMessage
};

module.exports = {
  validationConfig,
  formatValidationErrors,
}