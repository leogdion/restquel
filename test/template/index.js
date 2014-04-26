var template = require(__dirname + "/../../lib/template");
var chai = require('chai');
chai.should();

describe('template', function () {
  describe('#template', function () {
    var tmpl = template({
      text: 'select * from places where name = {{name}} and time = {{when}}',
      defaults: {
        when: "now"
      }
    });
    var ndtmpl = template({
      text: 'select * from places where name = {{name}} and time = {{when}}'
    });
    it('should translate correctly', function () {
      return tmpl.should.be.ok;
    });
    it('should create correct parametered query', function () {
      return tmpl.text().should.equal('select * from places where name = $1 and time = $2');
    });
    it('should create correct value array', function () {
      tmpl.values({
        name: 'test'
      }).should.deep.equal(['test', 'now']);
      ndtmpl.values({
        name: 'test'
      }).should.deep.equal(['test', undefined]);
      tmpl.values().should.deep.equal([undefined, 'now']);
    });
    it('should return the same thing', function () {
      var value = Math.random();
      return tmpl.results(value).should.equal(value);
    });
  });
});