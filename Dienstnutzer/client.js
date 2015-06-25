var context = require('rabbit.js').createContext('amqp://localhost:3000');

context.on('ready', function() {
  var express = require('express');
  var http = require('http');
  var app = express();
  var sub = context.socket('SUB');
  var pub = context.socket('PUB'); 
  sub.pipe(process.stdout);
  sub.connect('events', function() {
      sub.setEncoding('utf8');
       sub.on('data', function(note) { console.log("Alarum! %s", note); })
        sub.end();
    });
    console.log('Client is running, listening on Port 5000.')
app.listen(5000);
  });

function user(){
}

function message(){
}

function borrowed(){
}

function bookreturn(){
}



