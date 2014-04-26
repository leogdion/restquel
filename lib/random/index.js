var crypto = require('crypto');

module.exports = function (array) {
  var value;
  do {
    value = crypto.pseudoRandomBytes(8).toString('base64');
  } while (Array.isArray(array) && array.indexOf(value) >= 0);
  return value;
};