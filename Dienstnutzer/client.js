var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var app = express();
var request = require('request');
console.log('Dienstnutzer wurde gestartet. Lauscht auf 3001');

//Server erreichbar
request('http://localhost:3000/connect_server', function (error, response, body) {
  if (!error && response.statusCode == 200) {
    console.log(body);
  }
  if(error){
      console.log('Status:'+503+' Server nicht verfügbar');
  }
});

app.listen(3001);
