module.exports = function () {
  var restquel = function (configuration) {
    this.configuration = configuration;
  };

  restquel.prototype = {
    configuration: undefined,
    callback: function (request, response, next) {
      var key = this._getKey(request.path || require('url').parse(request.url).path);
      if (key) {
        response.writeHead(200, {
          'Content-Type': 'text/plain'
        });
        response.end(key + '\n');
      } else {
        next();
      }
    },
    _getKey: function (path) {
      return restquel.getKey(path, this.configuration.base);
    }
  };

  restquel.getKey = function (path, base) {
    var index = path.indexOf(base);

    if (!base || index === 0) {
      return path.substring(base.length + 1);
    } else {
      return path;
    }
  };

  restquel.fromConfiguration = function (configuration) {
    if (typeof configuration === "string") {
      configuration = require(configuration);
    }

    var _ = new restquel(configuration);

    return _.callback.bind(_);
  };

  return restquel.fromConfiguration;
}();