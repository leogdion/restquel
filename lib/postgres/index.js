var pg = require("pg.js"); /* istanbul ignore next */
module.exports = function (configuration) {
  var connection = function (configuration) {

  };

  connection.prototype = {
    query: function (queryConfiguration) {
      return query.prototype.run.bind(new query(this, queryConfiguration));
    }
  };

  var query = function (connection, query) {

  };

  query.prototype = {
    run: function (parameter, cb) {
      cb();
    }
  };

  return connection.prototype.query.bind(new connection(configuration));
};