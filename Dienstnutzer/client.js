var express = require('express');
var http = require('http');

var app = express();

var request = require('request');
request('http://localhost:3000/server', function (error, response, body) {
  if (!error && response.statusCode == 200) {
    console.log(body) // Show the HTML for the Google homepage.
  }
});
console.log('Anfrage ausgeführt');
app.listen(3001);