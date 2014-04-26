var random = require(__dirname + "/../../lib/random");
var chai = require('chai');
chai.should();

describe("random", function () {
  it('should return a string', function () {
    random().should.be.a('string').with.length.at.least(1);
  });
});