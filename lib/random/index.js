var crypto = require('crypto');

module.exports = function (sizeOrArray, array) {
  var size, value;
  if (Array.isArray(sizeOrArray)) {
    array = sizeOrArray;
    size = 8;
  } else if (typeof sizeOrArray === 'number') {
    size = sizeOrArray;
  } else {
    size = 8;
  }
  do {
    value = crypto.pseudoRandomBytes(size).toString('base64');
  } while (Array.isArray(array) && array.indexOf(value) >= 0);
  return value;
};