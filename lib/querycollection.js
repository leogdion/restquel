module.exports = function () {

  var querycollection = function (configuration) {

  };

  querycollection.prototype = {
    query : function (name, parameters, cb) {
      cb();
    }
  };

  querycollection.fromConfiguration = function (configuration) {
    var qc = new querycollection(configuration);

    return qc.query.bind(qc);
  };

  return querycollection.fromConfiguration;
}();