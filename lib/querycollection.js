module.exports = function () {

  var querycollection = function (configuration) {
    return (configuration && configuration.queries && configuration.database) ? querycollection.parse(configuration) : {};
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
    return querycollection.__query.bind(undefined, require(__dirname + "/" + database.dialect)(database), queries);
  };

  return querycollection;
}();