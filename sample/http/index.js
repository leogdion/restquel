var http = require('http'),
    restquel = require('../../index.js');

http.createServer(restquel(__dirname + "/../configuration.json")).listen(8080);