var express = require('express');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var app = express();

var context = require('rabbit.js').createContext('amqp://localhost');
var pub = context.socket('PUBLISH');

context.on('ready', function() {
  var pub = sub = context.socket('SUB');
  sub.pipe(process.stdout);
  sub.connect('events', function() {
      sub.setEncoding('utf8');
       sub.on('data', function(note) { console.log("Alarum! %s", note); })
        sub.end();
    });
  });


app.get('/', function(req,res){
    res.sendStatus(200, 'OK');
    console.log('Client erreichbar.');
});

function user(){
}

function message(){
}

function borrowed(){
}

function bookreturn(){
}



 console.log('Client is running, listening on Port 5000.')
app.listen(5000);