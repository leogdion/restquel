var http = require('http'),
    restquel = require('../../index.js');

var rql = restquel(__dirname + "/../configuration.json");
var server = http.createServer(rql);

rql.ready(server, 8080);

http.get("http://localhost:8080/api/v1/items", function (res) {});