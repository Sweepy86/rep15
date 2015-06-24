
var express = require('express');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var redis = require ("redis");
var client = redis.createClient();
var app = express();



app.get('/', function(req, res) {
	res.sendStatus(200);
});

app.get('/books', jsonParser, function(req, res) { // alle Bücher anzeigen
	client.keys("book:*", function(err, rep1){
		client.mget(rep1, function(err, rep){
			res.send(rep.json());
		});
	});
});

app.get('/books/:id', jsonParser, function(req, res) { // bestimmtes Buch anzeigen
	client.get("book:"+req.params.id, function(err, rep){
		res.send(rep.json());
	});
});

app.get('/user', jsonParser, function(req, res) { // alle User anzeigen
	client.keys("user:*", function(err, rep1){
		client.mget(rep1, function(err, rep){
			res.send(rep.json());
		});
	});
});

app.get('/user/:id', jsonParser, function(req, res) { // bestimmten user anzeigen
	client.get("user:"+req.params.id, function(err, rep){
		res.send(rep.json());
	});
});

app.post('/books', jsonParser,  function(req, res) { // neues buch hochladen
	var book = req.body;
	client.incr('bookcnt',function(err, rep1){ //Zähler für die Anzahl der Bücher wird erhöht.
	var id = 'book:'+rep1;
		client.set(id, JSON.stringify(book), function(err, rep2){ // mit dem Wert des Zählers wird ein neues Buch mit dem Inhalt der HTTP-Request erstellt.
			if (!err){
				console.log('new book created');
				res.send('Das Buch wurde erfolgreich erstellt');
				
				//Indizes werden erstellt
				client.set(JSON.stringify(book.ISBN), id, function(err){
					if (!err)
						console.log('Index 1 erstellt');
				});
				client.set(JSON.stringify(book.author), id, function(err){
					if (!err)
						console.log('Index 2 erstellt');
				});
				client.set(JSON.stringify(book.title), id, function(err){
					if (!err)
						console.log('Index 3 erstellt');
				});
				// Zuordnung von user zu Buch wird erstellt
				client.incr('uploadcnt'+ book.uploader, function (err, rep3){ 
					client.set(JSON.stringify(book.user_id)+':uploaded:'+id, id);// Format: user_id:uploaded:id
				});
				
				
			}
			else console.log(err);
		});
	});
});

app.delete('/books/:id', jsonParser, function delbook (req, res){// TODO ändern
	var book_id = 'book:'+ req.params.book_id;
	var user_id = 'user:' + req.params.id;
	client.get(id, function (req, rep){
		var book = rep.body.json();
		client.del(id, function(err, rep2){
			if (!err){
				console.log('book deleted');
				res.send('Das Buch wurde erfolgreich gelöscht');
			
				//Indizes werden gelöscht
				client.del(JSON.stringify(book.ISBN), function(err){
					if (!err)
						console.log('Index 1 gelöscht');
				});
				client.del(JSON.stringify(book.author), id, function(err){
					if (!err)
						console.log('Index 2 gelöscht');
				});
				client.del(JSON.stringify(book.title), id, function(err){
					if (!err)
						console.log('Index 3 gelöscht');
				});
				client.del(JSON.stringify(book.user_id)+'uploaded'+book_id, book_id);			
			}
			else console.log(err);
		});
	});	
});

app.post('/user/', jsonParser,  function(req, res) { // neuen User erstellen
	var user = req.body;
	client.incr('usercnt',function(err, rep1){ //Zähler wird erhöht.
		var id = 'user:'+rep1;
		client.set(id, JSON.stringify(user), function(err, rep2){ // mit dem Wert des Zählers wird ein neuer user mit dem Inhalt der HTTP-Request erstellt.
			if (!err){
				console.log('new user created');
				res.send('Der Nutzer wurde erfolgreich erstellt');
				
				//Index wird erstellt
				client.set(JSON.stringify(user.name), id);
			
			}
			else console.log(err);
		});
	});
});

app.delete('/user/:id', jsonParser, function(req, res){
	var user = client.get('user:'+ req.params.id).json();
	client.del('user:'+req.params.id);
	client.del(user.name);
	client.keys(req.params.id+':uploaded:*', function(res){
		for(var book in res){
			delbook(book);
		}
	});
	
});
app.get('/books/search', jsonParser, function(req, res) { // query zu key auflösen
	var query = req.body.json();
	client.exists(json.stringify(query), function(err, rep){
		if(!err){
			client.get(json.stringify(query), function(err, rep1){
				
				client.get(rep1, function(err, rep){
					res.send(rep.json());
				});
			});
		}
		else
			res.send('Das Buch existiert nicht!');
	});
});

app.get('/user/:id/books', jsonParser, function (req, res){ // ausgeliehene und hochgeladene eines Users Bücher anzeigen
	client.keys(req.params.id + '*', function(err, rep1){
		client.mget(rep1, function(err, rep){
			res.send(rep);
		});
	});
});
//TODO: nach datenstruktur anpassen
app.get('/user/:id/books/?status=uploaded', jsonParser, function (req, res){ // hochgeladene Bücher eines Users anzeigen
	client.keys(req.params.id + ':'+req.params.status+':*', function(err, rep1){
		client.mget(rep1, function(err, rep){
			res.send(rep);
		});
	});
});

app.get('/user/:id/books/?status=borrowed', jsonParser, function (req, res){ // ausgeliehene Bücher eines Users anzeigen
	client.keys( req.params.id + ':'+req.params.status+':*', function(err, rep1){
		client.mget(rep1, function(err, rep){
			res.send(rep);
		});
	});
});

app.put('/books/:id', jsonParser, function (req, res){ //Buch ausleihen
	var query = req.body.json();
	client.set(query.user_id+'borrowed'+req.params.id,'{ start:'+json.stringify(book.start)+', end:' + json.stringify(book.end)+', uploader: '+ query.user_id+' }',  function(err, rep1){ // zuordnung anlegen
		if (!err) 
			rep1.send('Buch ausgeliehen.');
		else
			rep.send('Ausleihen fehlgeschlagen.');
	});
});
app.delete('user/:id/books/?status=borrowed/:book_id', jsonParser(req, res){ //Buch zurückgeben
	client.del(req.params.id+':borrowed'+req.params.book_id, function(rep){
		if(!rep) res.send(404);
		else res.send(200);
	});
});

app.listen(3000);