var express = require('express');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

var app = express();

function dienst(err, data){
  if (err) {
    console.log('Error: ' + err);
    return;
  }
}
   
app.get('/connect_server', function(req, res) {
    res.send(200+" Dienstanbieter und Dienstnutzer sind verbunden").json();
});

app.get('/', function(req, res) {
    res.send(200+" Dienstanbieter in Betrieb").json();
});
console.log("Dienstanbieter gestartet. Lauscht auf Port 3000");
app.listen(3000);