var express = require('express');
var http = require('http');
var app = express();
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json()
var context = require('rabbit.js'); //Rabbit.js Einbindung
  	console.log('Server starts');
var context = require('rabbit.js').createContext('amqp://localhost');
var pub = context.socket('PUBLISH');

app.get('/', function(req, res) {
	res.sendStatus(200);
    console.log('Status:200 OK. Server ist erreichbar');
});

app.get('/testmes', function(req,res){
context.on('ready', function() {
  var pub = context.socket('PUB'), sub = context.socket('SUB');
  sub.pipe(process.stdout);
  sub.connect('events', function() {
    pub.connect('events', function() {
      pub.write(JSON.stringify({welcome: 'rabbit.js'}), 'utf8');
        pub.end();
    });
  });
    res.sendStatus(201);
});
});

//message servertest
app.get('/messages', function(req,res){
        res.sendStatus(503);

context.on('ready', function() {
  var pub = context.socket('PUB');
    pub.connect('events', function() {
      pub.write(JSON.stringify({welcome: 'rabbit.js'}), 'utf8');
	  pub.end();
    });
  });

});

app.listen(3000);