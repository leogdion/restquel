var fs = require('fs'),
    path = require('path');

module.exports = function (fs, path) {
  var restquel = function (configuration, next) {
    this.__configuration = configuration;
    this.__next = typeof next === "function" && next || undefined;
    this.__queries = require(__dirname + "/querycollection.js")(this.__configuration);
  };

  restquel.prototype = {
    __configuration: undefined,
    __next: undefined,
    __queries: undefined,
    callback: function (request, response, next) {
      var key = this._getKey(request.path || require('url').parse(request.url).pathname); /* istanbul ignore if */
      if (key && this.__queries[key]) {
        response.writeHead(200, {
          'Content-Type': 'text/plain'
        });
        this.__queries[key](query, this.respond.bind(this, key, response));
      } else if (next) {
        next();
      } else if (this.__next) {
        this.__next();
      } else {
        response.writeHead(404);
        response.end();
      }
    },
    ready: function (server) {
      return server.listen.apply(server, Array.prototype.slice.call(arguments, 1));
    },
    _getKey: function (path) {
      return restquel.getKey(path, this.__configuration && this.__configuration.base);
    },
    respond: /* istanbul ignore next */


    function (key, response, error, results) {
      response.end(JSON.stringify(error || results.rows));
    }
  };

  restquel.getKey = function (path, base) {
    var index = path.indexOf(base);

    if (base && index === 0) {
      return path.substring(base.length + 1);
    } else if (!base) {
      return path;
    }
  };

  restquel.fromConfiguration = function (configuration, next) {
    if (typeof configuration === "string") {
      var configurationPath = configuration;
      configuration = require(configuration);
      for (var key in configuration.queries) {
        var text = configuration.queries[key].text;
        var textPath = typeof text === 'string' && path.resolve(path.dirname(configurationPath), text);
        configuration.queries[key].text = (fs.existsSync(textPath) && fs.readFileSync(textPath).toString()) || text;
      }
    }

    var _ = new restquel(configuration, next);

    var cb = _.callback.bind(_);

    cb.ready = _.ready.bind(_);
    cb._ = _;

    return cb;
  };

  restquel.fromConfiguration.getKey = restquel.getKey;

  return restquel.fromConfiguration;
}(fs, path);