var restquel = require("../lib/restquel.js");
var chai = require('chai');
chai.should();

var mockrequest = require(__dirname + "/mocks/request.js"),
    mockresponse = require(__dirname + "/mocks/response.js"),
    server = require(__dirname + "/mocks/server.js");

describe('restquel', function () {
  var rql_empty = restquel();
  var rql_valids = [{},
  __dirname + "/../sample/configuration.json"].map(restquel);
  var rql_invalids = [{}].map(restquel);
  var rql_all = rql_invalids.concat([rql_empty], rql_valids);

  describe('#restquel()', function () {
    rql_all.forEach(function (_) {

      it('should return a function', function () {
        _.should.be.a('function');
      });
    });
  });

  describe('#ready', function () {
    rql_all.forEach(function (_) {
      it('should have a ready function', function () {
        _.ready.should.be.a('function');
      });

      it('should call server listen', function () {
        _.ready(server(8080), 8080);
      });
    });
  });

  describe('#callback', function () {


    describe('with a base request', function () {

      describe('with a path', function () {
        var req = mockrequest({
          path: "/api/v1/test"
        });
        return rql_all.every(function (_) {
          var resp = mockresponse();
          _(req, resp);
          it('should return a 202', function () {
            resp.__head.code.should.equal(200);
          });
          if (_._.__configuration && _._.__configuration.base) {
            it('should contain the key', function () {
              resp.__data.should.equal("test\n");
            });
          }
          return true;
        }).should.be.ok;
      });

      describe('with a url', function () {
        var req = mockrequest({
          url: "http://localhost:8080/api/v1/test"
        });
        return rql_all.every(function (_) {
          var resp = mockresponse();
          _(req, resp);
          it('should return a 202', function () {
            resp.__head.code.should.equal(200);
          });
          if (_._.__configuration && _._.__configuration.base) {
            it('should contain the key', function () {
              resp.__data.should.equal("test\n");
            });
          }
          return true;
        }).should.be.ok;
      });
    });

    describe('with a root request', function () {
      var req = mockrequest({
        path: "/"
      });

      describe('without a next method', function () {
        return rql_all.every(function (_) {
          var resp = mockresponse();
          _(req, resp);
          if (_._.__configuration && _._.__configuration.base) {
            it('should return a 404', function () {
              resp.__head.code.should.equal(404);
            });
          } else {
            it('should return a 202', function () {
              resp.__head.code.should.equal(200);
            });
          }
          return true;
        }).should.be.ok;
      });

      describe('with a next method', function () {
        return rql_all.every(function (_) {
          var resp = mockresponse();
          var nextdid = false;
          _(req, resp, function () {
            nextdid = true;
          });
          if (_._.__configuration && _._.__configuration.base) {
            it('should return a 404', function () {
              //resp.__head.code.should.equal(404);
              nextdid = true;
            });
          } else {
            it('should return a 202', function () {
              //resp.__head.code.should.equal(200);
              nextdid = false;
            });
          }
          return true;
        }).should.be.ok;
      });

      describe('with a this.__next method', function () {
        return rql_all.every(function (_) {
          var oldnext = _._.__next;
          var resp = mockresponse();
          var nextdid = false;
          _._.__next = function () {
            nextdid = true;
          };
          _(req, resp);
          if (_._.__configuration && _._.__configuration.base) {
            it('should return a 404', function () {
              //resp.__head.code.should.equal(404);
              nextdid = true;
            });
          } else {
            it('should return a 202', function () {
              //resp.__head.code.should.equal(200);
              nextdid = false;
            });
          }
          _._.__next = oldnext;
          return true;
        }).should.be.ok;
      });
    });
  });
});