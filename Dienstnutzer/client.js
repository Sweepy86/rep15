var express = require('express');
var http = require('http');

var app = express();

var request = require('request');
request('http://localhost:3000/connect_server', function (error, response, body) {
  if (!error && response.statusCode == 200) {
    console.log(body) // 
  }
});
console.log('Anfrage ausgeführt');
app.listen(3001);
