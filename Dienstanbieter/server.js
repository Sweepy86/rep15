var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json()
var context = require('rabbit.js'); //Rabbit.js Einbindung

app.get('/', function(req, res) {
	res.sendStatus(200);


var context = require('rabbit.js').createContext('amqp://localhost');
context.on('ready', function() {
  var pub = context.socket('PUB');
    pub.connect('events', function() {
      pub.write(JSON.stringify({welcome: 'rabbit.js'}), 'utf8');
	  pub.end();
    });
  });
  	console.log('Server starts');
});
