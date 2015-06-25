var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var app = express();
var request = require('request');
var net = require('net');

var amqp = require('amqp');
var sys = require('sys');

console.log('Dienstnutzer wurde gestartet. Lauscht auf 3001');

//new
function subSocket(connection, client, exchangeName) {
    sys.log('sub socket opened');
    function consume(exchange) {
        queue = connection.queue('', {durable:false}, function() {
            queue.subscribe(function(message) {
                debug('sub:'); debug(message);
                client.send(message.data.toString());
            });
            queue.bind(exchange.name, '');
        });
    };
    (exchangeName == '') ?
        connection.exchange('amq.fanout', {'passive': true}, consume) :
        connection.exchange(exchangeName, {'type': 'fanout'}, consume);
}
/*var context = new require('rabbit.js').createContext('amqp://localhost:3000');
var sub = context.socket('SUBSCRIBE');

function message(){
sub.connect('alerts');
sub.setEncoding('utf8');
sub.on('data', function(note) { console.log("Alarum! %s", note); });
sub.pipe(process.stdout);
sub.close();
};*/

//Server erreichbar
request('http://localhost:3000/connect_server', function (error, response, body) {
  if (!error && response.statusCode == 200) {
    console.log(body);
  }
  if(error){
      console.log('Status:'+503+' Server nicht verfügbar');
  }
});

app.get('/', function(req,res){
    res.sendStatus(200, 'OK');
    console.log('Client erreichbar.');
});

app.listen(3001);