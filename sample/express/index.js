var express = require('express'),
    restquel = require('../../index.js');
var app = express();
var rql = restquel(__dirname + "/../configuration.json");

app.use(rql);

rql.ready(app, 8080);