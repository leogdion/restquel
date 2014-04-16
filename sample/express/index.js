var express = require('express'),
    restquel = require('../../index.js');
var app = express();

app.use(restquel(__dirname + "/../configuration.json"));
//app.get('/', function(req, res){
//  res.send('hello world');
//});
app.listen(8080);