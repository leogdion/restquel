var querycollection = require(__dirname + "/../lib/querycollection.js");
var chai = require('chai');
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
describe('querycollection', function () {

  it('should return an array', function (done) {
    querycollection(config).items({
      "area": "foo"
    }, function (err, results) {

      done();
    });
  });
});