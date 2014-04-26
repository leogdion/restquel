var S = require('string');

module.exports = function (S) {
  var tmplregex = /{{\s*[\w\.]+\s*}}/g;

  function unique(value, index, array) {
    return array.indexOf(value) === index;
  }

  function key(x) {
    return x.match(/[\w\.]+/)[0];
  }

  function tmplparam(obj, key, index) {
    obj[key] = '$' + (index + 1);
    return obj;
  }

  var template = function (query) {
    if (!(this instanceof template)) {
      return new template(query);
    }

    this.__parameters = (query.text.match(tmplregex) || []).map(key).filter(unique);
    this.__text = S(query.text).template(this.p()).s;
    this.__defaults = query.defaults || {};
  };

  template.__values = function (values, defaults, key) {
    return key in values ? values[key] : defaults[key];
  };

  template.values = function (values, defaults) {
    return template.__values.bind(undefined, values, defaults);
  };

  template.prototype = {
    __parameters: undefined,
    text: function () {
      return this.__text;
    },
    values: function (v) {
      v = v || {};
      return this.__parameters.map(template.values(v, this.__defaults));
    },
    results: function (r) {
      return r;
    },
    p: function () {
      return this.__parameters.reduce(tmplparam, {});
    }
  };

  template.unique = unique;
  template.key = key;
  template.tmplparam = tmplparam;

  return template;
}(S);