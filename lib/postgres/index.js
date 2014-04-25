var pg = require("pg.js"),
    random = require(__dirname + "/../random"),
    template = require(__dirname + "/../template");

/* istanbul ignore next */
module.exports = function (configuration) {
  var connection = function (configuration) {
    this.__configuration = configuration;
  };

  connection.__names = [];

  connection.newName = function () {
    var name = random(connection.__names);
    connection.__names.push(name);
    return name;
  };

  connection.prototype = {
    __client: undefined,
    query: function (queryConfiguration) {
      return query.prototype.run.bind(new query(this, queryConfiguration));
    },
    connect: function (cb) {
      if (this.__client) {
        cb(undefined, this.__client);
      } else {
        pg.connect(configuration, this.onConnection.bind(this, cb));
      }
    },
    onConnection: function (cb, error, client) {
      if (error) {
        cb(error);
        return;
      }
      this.__client = client;
      cb(undefined, this.__client);
    },
    newName: connection.newName
  };

  var query = function (connection, query) {
    this.__connection = connection;
    this.__name = connection.newName();
    this.__template = template(query);
    this.__prepared = false;
  };

  query.prototype = {
    run: function (values, cb) {
      this.__connection.connect(this.onClientConnect.bind(this, values, cb));
    },
    onClientConnect: function (values, cb, error, client) {
      if (error) {
        cb(error);
        return;
      }
      client.query(this.p(values), this.onQueryEnd.bind(this, cb));
    },
    onQueryEnd: function (cb, error, results) {
      cb(error, this.__template.results(results));
    },
    p: function (values) {
      var q = {};
      if (!this.__prepared) {
        q.text = this.__template.text();
        this.__prepared = true;
      }
      q.name = this.__name;
      q.value = this.__template.values(values);
      return q;
    }
  };

  return connection.prototype.query.bind(new connection(configuration));
};