var querycollection = require(__dirname + "/../lib/querycollection.js");
var chai = require('chai');
chai.should();

describe('querycollection', function () {
  it('should return a function', function () {
    var value = false;
    querycollection().should.be.a('function');
    querycollection()(null, null, function () {
      value = true;
    });
    return value.should.be.ok;
  });
});