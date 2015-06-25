var express = require('express');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var fs = require('fs');

var app = express();

fs.readFile(__dirname + "/book/book.json", 'utf8', function (err, data){
  if (err) {
    console.log('Error: ' + err);
    return;
  }
    
var book = JSON.parse(data.toString());

console.log("Dienstanbieter gestartet");

app.get('/server', function(req, res) {
    res.send(200+" Dienstanbieter und Dienstnutzer sind verbunden").json();
});

app.get('/book', function(req, res){
    res.status(200).json(book); //sendet die Daten der Ressource /book zurueck
});

    
app.post('/book', jsonParser, function(req, res){
         book.book.push(req.body);
        fs.writeFile(__dirname + "/book/book.json", JSON.stringify(book), function(err, data){
        if (err){
        console.log('Error' + err);
        return;
        }
        console.log("Datei wurde gesichert.");
    res.send(200+" Buch wurde gespeichert").json();
        
    });
    //res.type('plain').send('Hinzugefügt');
});


app.put('/book', jsonParser, function(req, res){
//hier neu - Datei ueberschreiben
    book.book = req.body; 
fs.writeFile(__dirname + "/book/book.json", JSON.stringify(book), function(err, data){
        if (err){
        console.log('Error' + err);
        return;
        }
        console.log("Datei wurde gesichert.");
    res.send(200+" Buch wurde gespeichert").json();
        
    });

});

});

// accept DELETE request at /user
//app.delete('/book', function (req, res) {
//  res.send('Got a DELETE request at /book');
//});

app.listen(3000);