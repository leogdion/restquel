var mockresponse = function () {
  if (this instanceof mockresponse) {
    this.__data = "";
    this.__head = {
      code: undefined,
      headings: {}
    };
  } else {
    return new mockresponse();
  }
};

mockresponse.prototype = {
  __data: undefined,
  __head: undefined,
  writeHead: function (code, headings) {
    this.__head.code = code;
    for (var key in headings) {
      this.__head.headings[key] = headings[key];
    }
  },
  end: function (text) {
    if (text) {
      this.__data += text.toString();
    }
  }
};

module.exports = mockresponse;