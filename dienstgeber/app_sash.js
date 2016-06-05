var parser = require('body-parser');
var jsonp = parser.json();
var express = require('express');
var fs = require('fs');

var app = express();


//TODO 1 Die Fähigkeiten/Voraussetzungen würden sich als eigene Ressourcen lohnen, bietet  eiene gute Grundlage, um Hypermedia einzusetzen. DAzu wären mehrere Funktionen verfügbar
//TODO 2 Falls 1 übernommen wirs, Tabelle auf GitHub aktualisieren!
//TODO 3 Spätestens für eine DB muss eine ID angelegt werden. die muss wahrscheinlich in einer eigenen Datei gespeichert werden
//TODO 4 Vielleicht wäre verschiedene Ressourcen für Student und Prof doch sinnvoller, Vor Allem für die ID-verteilung (der Logik nach sowieso)
//TODO 5 PUT Methode auf ganzen Listen blockiert, weil unnötig. wenn die Tabelle geändert werden muss, dann um user zu erstellen, löschen oder zu ändern (Fälle sind schon abgedeckt)
app.all('/', jsonp, function(req, res){
  console.log('Verbindung hergestellt!');
  res.status(200).send('Hi there!');
  res.end;
});

app.route('/user')
  .get(jsonp, function(req, res){
    var student = JSON.parse(fs.readFileSync(__dirname+"/student.json"));
    var prof = JSON.parse(fs.readFileSync(__dirname+"/prof.json"));
    res.status(200).json(prof.push(student));
  })
  .put(jsonp, function(req, res){
    res.status(501);
  })
  .post(jsonp, function(req, res){
    var user = req.body;
    if(user.status=="student" | user.status == "prof"){
  		if(reg(user)){
        console.log('201');
        res.status(201).send("User created!");
      }
      else{
        console.log(400);
        res.status(400).send('User could not be created!');
      }
    }
    else {
      console.log('User ist weder Student noch Prof!');
      res.send('User ist weder Student noch Prof!');
    }
  })
  .delete(jsonp, function(req, res){
    res.status(501);
  });

app.route('/user/:id')
  .get()
  .put()
  .post(jsonp, function(req, res){
    res.status(501);
  })
  .delete(jsonp, function(req, res){
    var uid = req.params.id.split("_")[1];
    if(req.params.id.split("_")[0]) var status = 'student';
    else var status = 'prof';
    fs.access(__dirname+"/"+status+".json", fs.F_OK,function(err){
      if(!err){
        list = JSON.parse(fs.readFileSync(__dirname+"/"+status+".json"));
        list.splice(uid, 1);
        fs.writeFile(__dirname+"/"+status+".json", JSON.stringify(list), function(err){
          if(!err){
            console.log(status +' '+ uid +' gelöscht!');
          }
        });
      }
    });
  });

app.route('workshop')
  .get(jsonp, function(req, res){
    var workshop = JSON.parse(fs.readFileSync(__dirname+"/workshop.json"));
    res.status(200).json(student);
  })
  .put(jsonp, function(req, res){
    res.status(501);
  })
  .post(jsonp, function(req, res){
    var workshop = req.body;
    if(user.status=="workshop"){
      if(reg(workshop)){
        console.log('201');
        res.status(201).send("Workshop created!");
      }
      else{
        console.log(400);
        res.status(400).send('Workshop could not be created!');
      }
    }
    else {
      console.log('Die gesendeten Daten sind kein Workshop');
      res.send('Die gesendeten Daten sind kein Workshop!');
    }
  })
  .delete(parser, function(req, res){
    res.status(501);
  });

app.route('workshop/:id')
  .get()
  .put()
  .post(parser, function(req, res){
    res.status(501);
  })
  .delete();

app.route('/workshop/:uid/msg')
  .get()
  .put()
  .post()
  .delete()

app.route('/workshop/:uid/msg/:mid')
  .get()
  .put()
  .post(parser, function(req, res){
    res.status(501);
  })
  .delete()
/*
  var prof_reg = function (user) {
  	fs.appendFile(__dirname+"/professor.json", JSON.stringify(user), function(err) {
      console.log("Professor angelegt!");
    });
  }

  // Problem in der Methode: list muss als json initialisiert werden um die formatierungsprobleme zu entfernen, nur wird dann die push funktion nicht unterstützt
var student_reg = function (user) {
  fs.access(__dirname+"/student.json", fs.F_OK,function(err){// Test, ob die Datei existiert, wenn ja, wird sie eingelesen und der User angehangen, wenn nein, wird eine neue Datei erstellt.
    var list = [];
    if(!err)
      list = JSON.parse(fs.readFileSync(__dirname+"/student.json"));
    list.push(user);
    console.log(list);
    fs.writeFile(__dirname+"/student.json", JSON.stringify(list), function(err){
      if(!err){
        console.log('Student erstellt!');
        return 1;
      }
      else return 0;
    });
  });
}
*/

// Vorschag einer allgemeinen Methode, umUser/Nachrichten/Workshops in eine Datei zu schreiben. Sinnvoll dafür wäre, dass jedes Objekt ein 'Status' Attribut besistz, nach diesem Status werden sie dann einfach auf die Zieldateien aufgeteilt.
var reg = function (JSONObj){
  var list = [];
  status = JSONObj.status();
  fs.access(__dirname+"/"+status+".json", fs.F_OK,function(err){
    if(!err){
      list = JSON.parse(fs.readFileSync(__dirname+"/"+status+".json"));
      if(list.indexOf(JSONObj)!= -1)return 0;
    }
    var id_list = JSON.parse(fs.readFileSync(__dirname+"/id_list.json"));
    var index = getItem(id_list, status, 'status');
    index.id += 1; //sucht den passenden eintrag aus dem array und inkrementiert ihn.
    if(JSONObj.status == 'prof') JSONObj.id = '0_'+index.id;
    else if(JSONObj.status == 'student') JSONObj.id = '1_'+index.id;
    else JSONObj.id = index.id;
    list.push(JSONObj);
    fs.writeFileSync(__dirname+"id_list.json", JSON.stringify(id_list));
    fs.writeFile(__dirname+"/"+status+".json", JSON.stringify(list), function(err){
      if(!err){
        console.log(status +' erstellt!');
        return 1;
      }
      else return 0;
    });
  });
}

var getItem = function(array, value, attribute){
  array.find(function(item){
    return eval('item.'+ attribute+'== value');
  });
}
var getIndex = function(array, id){
  array.findIndex(function(item){
    return item.id == id;
  })
}
app.listen(1337);
