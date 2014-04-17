module.exports = function () {
  var expected = Array.prototype.slice.call(arguments, 0);
  return {
    listen: function () {
      var actual = Array.prototype.slice.call(arguments, 0);
      actual.should.have.members(expected);
    }
  };
};