const validator = require('validator');

// Fungsi validasi khusus untuk URL
const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error('string.uri');
};

module.exports = {
  validateURL,
};
