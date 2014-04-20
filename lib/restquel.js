module.exports = function () {
  var restquel = function (configuration, next) {
    this.__configuration = configuration;
    this.__next = typeof next === "function" && next || undefined;
    this.__queries = require(__dirname + "/querycollection.js")(this.__configuration);
  };

  restquel.prototype = {
    __configuration: undefined,
    __next: undefined,
    callback: function (request, response, next) {
      var key = this._getKey(request.path || require('url').parse(request.url).path);

      if (key) {
        response.writeHead(200, {
          'Content-Type': 'text/plain'
        });
        response.end(key + '\n');
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
      configuration = require(configuration);
    }

    var _ = new restquel(configuration, next);

    var cb = _.callback.bind(_);

    cb.ready = _.ready.bind(_);
    cb._ = _;

    return cb;
  };

  return restquel.fromConfiguration;
}();