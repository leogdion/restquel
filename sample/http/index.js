var http = require('http'),
 restquel = require('../../index.js');

console.log(restquel);
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World\n');
}).listen(8080);