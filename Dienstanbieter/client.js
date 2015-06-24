var express = require('express');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var app = express();
var context = require('rabbit.js').createContext('amqp://localhost'); //Rabbit.js Einbindung

var context = new require('rabbit.js').createContext('amqp://localhost');
var inServer = net.createServer(function(connection) {
  var s = context.socket('PUB');
  s.connect('incoming', function() {
    connection.pipe(s);
  });
});
inServer.listen(5000);

//TODO User erstellen

//TODO Buch erstellen

//TODO Buch ausleihen


/*context.on('ready', function() {
  var pub = context.socket('PUB');
  sub.pipe(process.stdout);
  sub.connect('events', function() {
  sub.setEncoding('utf8');
sub.on('data', function(note) { console.log("Alarum! %s", note); });
    });
});

//TODOS Messagequeue -> Buch verliehen, Buch gelehen, Buch zurückgegeben */
