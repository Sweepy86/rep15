
var express = require('express');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var redis = require ("redis");
var client = redis.createClient();
var app = express();

var context = require('rabbit.js').createContext('amqp://localhost');
var sub = context.socket('SUBSCRIBE');
sub.connect('alerts');
sub.setEncoding('utf8');
sub.on('data', function(note) { console.log("Alarum! %s", note); });

//TODOS Messagequeue
