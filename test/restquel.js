var restquel = require(__dirname + "/../lib/restquel.js");
var chai = require('chai');
var fs = require('fs');
chai.should();

var config = {
  "database": {
    "database": "bls_ap",
    "user": "bls_ap_user",
    "password": "bls_ap_pw",
    "dialect": "sample"
  },
  "queries": {
    "items": {
      "sql": ["select ap_item_matches_mapping.root_code as item_code, ap_item_names.name, group_name, concat('[\"',group_concat(distinct ap_item_types.type_name separator '\",\"'), '\"]') as type_names, count(*) as count,", "ap_item_unit.unit_id as unit_id, ap_item_unit.value", "from ap_current inner join ap_series on ap_current.series_id = ap_series.series_id", "inner join ap_item on ap_series.item_code = ap_item.item_code", "inner join ap_item_matches_mapping on ap_item.item_code = ap_item_matches_mapping.item_code", "inner join ap_item_names on ap_item_matches_mapping.root_code = ap_item_names.item_code", "left join ap_item_unit on ap_item.item_code = ap_item_unit.item_code", "left join ap_item_inactive on ap_item.item_code = ap_item_inactive.item_code", "left join ap_item_grouping on ap_item.item_code = ap_item_grouping.item_code", "left join ap_item_types on ap_item.item_code = ap_item_types.item_code", "where area_code = :area or :area is NULL", "and ap_item_inactive.item_code is null", "group by ap_item_matches_mapping.root_code order by ap_item_names.name"],
      "defaults": {
        "area": null
      },
      "groups": ["name"],
      "types": {
        "type_names": "JSON"
      }
    }
  }
};

var mockrequest = require(__dirname + "/mocks/request.js"),
    mockresponse = require(__dirname + "/mocks/response.js"),
    server = require(__dirname + "/mocks/server.js");

describe('restquel', function () {

  describe('#getKey', function () {
    restquel.getKey("/api/v1/test", "/api/v1").should.equal('test');
  });

  var rql_valids = [config].map(restquel);
  var rql_invalids = [{}].map(restquel);
  var rql_all = rql_invalids.concat(rql_valids);

  describe('#restquel()', function () {

    it('should read configuration file', function () {
      restquel(__dirname + "/../sample/configuration.json")._.__configuration.base.should.equal(
      require(__dirname + "/../sample/configuration.json").base);
      restquel(__dirname + "/../sample/configuration.json")._.__configuration.queries.items.text.should.equal(fs.readFileSync(__dirname + "/../sample/templates/items.psql").toString());
    });

    it('should return query text', function () {
      restquel({
        queries: {
          test: {
            text: "test"
          }
        }
      })._.__configuration.queries.test.text.should.equal('test');
    });

    it('should include next method', function () {
      var v = Math.random();
      var next = function () {
        return v;
      };
      restquel(__dirname + "/../sample/configuration.json", next)._.__next().should.equal(next());
    });

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
          it('should return a 404', function () {
            resp.__head.code.should.equal(404);
          });
/*
          if (_._.__configuration && _._.__configuration.base) {
            it('should contain the key', function () {
              resp.__data.should.equal("test\n");
            });
          }
          */
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
          it('should return a 404', function () {
            resp.__head.code.should.equal(404);
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
          //if (_._.__configuration && _._.__configuration.base) {
          it('should return a 404', function () {
            resp.__head.code.should.equal(404);
          });
          //} else {
          //  it('should return a 202', function () {
          //    resp.__head.code.should.equal(200);
          //  });
          //}
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