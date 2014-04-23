module.exports = function () {

  var querycollection = function (configuration) {
    this.__queries = (configuration && configuration.queries && configuration.database) ? querycollection.parse(configuration) : {};
  };

  querycollection.prototype = {
    __queries: undefined,
    query: function (name, parameters, cb) {
      this.__queries[name](parameters, cb);
    }
  };

  querycollection.fromConfiguration = function (configuration) {
    var qc = new querycollection(configuration);
    return qc.query.bind(qc);
  };

  querycollection.parse = function (configuration) {
    return Object.keys(configuration.queries).reduce(querycollection.query(configuration.database, configuration.queries), {});
  };

  querycollection.__query = function (factory, queries, collection, key) {
    collection[key] = factory(queries[key]);
    return collection;
  };

  querycollection.query = function (database, queries) {
    return querycollection.__query.bind(undefined, require(__dirname + "/" + database.dialect), queries);
  };

  return querycollection.fromConfiguration;
}();