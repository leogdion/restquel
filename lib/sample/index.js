module.exports = function () {

  var factory = function (configuration) {
    return function (parameters, cb) {
      cb();
    };
  };

  return factory;
}();