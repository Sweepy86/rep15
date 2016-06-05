
var parser = require('body-parser');
var jsonp = parser.json();
var express = require('express');
var fs = require('fs');
var chalk = require('chalk');
var app = express();


//TODO 1 Die Fähigkeiten/Voraussetzungen würden sich als eigene Ressourcen lohnen, bietet  eiene gute Grundlage, um Hypermedia einzusetzen. DAzu wären mehrere Funktionen verfügbar
//TODO 2 Falls 1 übernommen wirs, Tabelle auf GitHub aktualisieren!
//TODO 3 Spätestens für eine DB muss eine ID angelegt werden. die muss wahrscheinlich in einer eigenen Datei gespeichert werden
app.get('/', jsonp, function(req, res){
  console.log(chalk.green('Verbindung hergestellt!'));
  res.status(200).send('Hi there!');
  res.end;
});

app.route('/user')
  .get(jsonp, function(req, res){
    try{
      var student = JSON.parse(fs.readFileSync('student.json'));
      var prof = JSON.parse(fs.readFileSync('prof.json'));
      var user = student.students.concat(prof.profs);

      res.status(200).send(user);
      res.end();
      console.log("Die User-Liste wurde ausgegeben.");
    }
    catch(err){
        if(err) console.log(err + '\n\n');
        res.end();
    }
  })
  .put(jsonp, function(req, res){
    res.status(501);
  })
  .post(jsonp, function(req, res){
    var user = req.body;
    if(spw(user.id) == 2  |spw(user.id) == 3){
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
  .delete()

app.route('/user/prof')
.get(jsonp, function(req, res){
try{
var prof = JSON.parse(fs.readFileSync(__dirname+"/prof.json"));

res.status(200).send(prof);
res.end();
console.log(chalk.green("Die Professoren-Liste wurde ausgegeben."));
}
catch(err){
  if(err) console.log(err + '\n\n');
  res.end();
}
})
  .put()
  .post()
  .delete();

app.route('/user/prof/:id')
  .get(jsonp, function(req, res){
    try{
      var id = req.params.id;
      var profs = JSON.parse(fs.readFileSync(__dirname+"/prof.json")).profs;
      var prof = getObjByID(profs, id);
      if(prof===undefined){
        console.log(chalk.red('User nicht gefunden'));
        res.status(404).end();
        }
        else{
          console.log(chalk.green('User gefunden:'));
          console.log(prof);
          console.log(' ');
          res.status(200).json(prof).end();
        }
    }
    catch(err){
      if(err) console.log(err + '\n\n');
      res.end();
    }
  })
  .put(jsonp, function(req, res){
    try{
      var id = req.params.id;
      var profs = JSON.parse(fs.readFileSync(__dirname+"/prof.json")).profs;

      //user in der Liste?
      var index = getIndexByID(profs, id);
      var prof = getObjByID(profs, id);

      if(prof===undefined){
      console.log(' ');
      console.log(chalk.red('User nicht gefunden'));
      console.log(' ');
    res.status(404).send('User nicht gefunden');
          }
        else{
      console.log(' ');
      console.log(chalk.green('User gefunden:'));
      console.log('Index im Array: '+index);
      console.log(prof);
      console.log(' ');

      var change_user = req.body;
      var new_change_user = changeUser(prof, change_user, index);

      console.log(chalk.green('Daten geändert: '));
      console.log(new_change_user);
      console.log('---');
      console.log(' ');
      profs[index] = new_change_user;
      var beginn = '{ "profs": ';
      var end = ' }';
      fs.writeFileSync(__dirname+"/prof.json", beginn.toString() +JSON.stringify(profs) + end.toString());
      res.end();
    }
    }
catch(err){
  if(err) console.log(err + '\n\n');
  res.end();
}
})
  .post()
  .delete(jsonp, function(req, res){
    if(spw(req.params.id)==3) {
        var profs = JSON.parse(fs.readFileSync(__dirname+"/prof.json")).profs;
        var id = req.params.id;
        var prof = getObjByID(profs, id);

        console.log(chalk.red('Prof löschen: '));

        if(prof!=undefined){
            console.log(prof);
            rm(req.params.id,"prof.json");
            //  res.status(501);
            console.log(chalk.green(req.params.id + " erfolgreich gelöscht!"));
            res.status(200).send(req.params.id + " erfolgreich gelöscht!");
        }
        else {
            prof = 'User existiert nicht';
            console.log(prof);
            console.log(chalk.red('User nicht gefunden. Daher nicht gelöscht'));
            res.status(404).send(req.params.id + " User nicht gefunden. Daher nicht gelöscht.");
          }
    }
  });

app.route('/user/student')
.get(jsonp, function(req, res){
try{
var student = JSON.parse(fs.readFileSync(__dirname+"/student.json"));

res.status(200).send(student);
res.end();
console.log(chalk.green("Die Studenten-Liste wurde ausgegeben."));
}
catch(err){
  if(err) console.log(err + '\n\n');
  res.end();
}
})
  .put()
  .post()
  .delete()

app.route('/user/student/:id')
.get(jsonp, function(req, res){
  try{
    var id = req.params.id;
    var students = JSON.parse(fs.readFileSync(__dirname+"/student.json")).students;
    var student = getObjByID(students, id);
    if(student===undefined){
      console.log(chalk.red('User nicht gefunden'));
      res.status(404).end();
      }
    else{
      console.log(chalk.green('User gefunden:'));
      console.log(student);
      console.log(' ');
      res.status(200).json(student).end();
    }
  }
  catch(err){
    if(err) console.log(err + '\n\n');
    res.end();
  }
})
.put(jsonp, function(req, res){
  try{
    var id = req.params.id;
    var students = JSON.parse(fs.readFileSync(__dirname+"/student.json")).students;

    //user in der Liste?
    var index = getIndexByID(students, id);
    var student = getObjByID(students, id);

    if(student===undefined){
    console.log(' ');
    console.log(chalk.red('User nicht gefunden'));
    res.status(404).send('User nicht gefunden');
        }
      else{
    console.log(' ');
    console.log(chalk.green('User gefunden:'));
    console.log('Index im Array: '+index);
    console.log(student);
    console.log(' ');

    var change_user = req.body;
    var new_change_user = changeUser(student, change_user, index);

    console.log(chalk.green('Daten geändert: '));
    console.log(new_change_user);
    console.log('---');
    console.log(' ');

    students[index] = new_change_user;
    var beginn = '{ "students": ';
    var end = ' }';
    fs.writeFileSync(__dirname+"/student.json", beginn.toString() +JSON.stringify(students) + end.toString());
    res.end();
  }
}
catch(err){
  if(err) console.log(err + '\n\n');
  res.end();
}
})
  .post()
  .delete(jsonp, function(req, res){
    if(spw(req.params.id)==2) {
      var students = JSON.parse(fs.readFileSync(__dirname+"/student.json")).students;
      var id = req.params.id;
      var student = getObjByID(students, id);

      console.log(chalk.red('Student löschen: '));

      if(student!=undefined){
          console.log(student);
          rm(req.params.id,"student.json");
          //  res.status(501);
          console.log(chalk.green(req.params.id + " erfolgreich gelöscht!"));
          res.status(200).send(req.params.id + " erfolgreich gelöscht!");
      }
        else {
            prof = 'User existiert nicht';
            console.log(student);
            console.log(chalk.red('User nicht gefunden. Daher nicht gelöscht'));
            res.status(404).send(req.params.id + " User nicht gefunden. Daher nicht gelöscht.");
          }
    }
  });

app.route('/workshop')
  .get(jsonp, function(req, res){
    var workshop = JSON.parse(fs.readFileSync(__dirname+"/workshop.json"));
    res.status(200).json(student);
  })
  .put(jsonp, function(req, res){
    res.status(501);
  })
  .post(jsonp, function(req, res){
    var workshop = req.body;
    if(spw(workshop.id)){
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

app.route('/workshop/:id')
  .get(jsonp, function(req, res){
    var file = fs.readFileSync(__dirname+"/workshop.json");
    res.send(getObjByID(file, id));
  })
  .put()
  .post(parser, function(req, res){
    res.status(501);
  })
  .delete(jsonp, function(req, res){
      rm(req.params.id,"vorlage_workshops.json");
      console.log(req.params.id + " erfolgreich gelöscht!");
      res.status(200);
      res.send(req.params.id + " erfolgreich gelöscht!");
  });

app.route('/workshop/:uid/msg')
  .get()
  .put()
  .post()
  .delete()

app.route('/workshop/:uid/msg/:mid')
.get(jsonp, function(req, res){
  var file = fs.readFileSync(__dirname+"/msg.json");
  res.send(getObjByID(file, id));
})
  .put()
  .post(parser, function(req, res){
    res.status(501);
  })
  .delete()

   app.route('/workshop/:wid/teilnehmer/')
   .get(jsonp, function(req, res){
     var file = JSON.parse(fs.readFileSync(__dirname+"/workshops_teilnehmer.json"));
     file.Workshops.forEach(function (workshop, index) {
       if (workshop.id === req.params.wid) {
         res.send(JSON.stringify(workshop));
         res.status(200);
       }
     })
   })
   .put()
   .post(jsonp, function(req, res){
     var file = JSON.parse(fs.readFileSync(__dirname+"/workshops_teilnehmer.json"));
     file.Workshops.forEach(function (workshop, index) {
       if (workshop.id === req.body.id) {
           console.log(workshop.id + " ist bereits vorhanden!");
           res.status(200);
           res.send("Dieser Workshop ist bereits vorhanden!");
           throw new Error("Workshop " + workshop.id + " ist bereits vorhanden!");
       }
     })
     file.Workshops.push(req.body);
     fs.writeFileSync(__dirname+"/workshops_teilnehmer.json", JSON.stringify(file));
     console.log(req.body.id + "wurde erfolgreich erstellt!");
     res.status(200);
     res.send(req.body.id + "wurde erfolgreich erstellt!")
    })
    .delete(jsonp, function(req, res){
      rm(req.params.wid,"workshops_teilnehmer.json");
      console.log(req.params.wid + " erfolgreich gelöscht!");
      res.status(200);
      res.send(req.params.wid + " erfolgreich gelöscht!");
    });

    app.route('/workshop/:wid/teilnehmer/:id')
    .get()
    .put()
    .post(jsonp, function(req, res){
      var flag = 0;
      var file = JSON.parse(fs.readFileSync(__dirname+"/workshops_teilnehmer.json"));


        file.Workshops.forEach(function (workshop, index) {
          if (workshop.id === req.params.wid) {
            flag=1;
            var n=workshop.subscribers.find(subscribers => workshop.subscribers === req.params.id);
            console.log(n);
          }
        })

        if (flag!=1) {
          throw new Error("Workshop " + req.params.wid + " ist nicht vorhanden!");
        }


      file.Workshops.forEach(function (workshop, index) {
        if (workshop.id === req.params.wid) {
          workshop.subscribers.push(req.params.id);
          fs.writeFileSync(__dirname+"/workshops_teilnehmer.json", JSON.stringify(file));
        }
      })
    })
    .delete(jsonp, function(req, res){
         var file = JSON.parse(fs.readFileSync(__dirname+"/workshops_teilnehmer.json"));
         var list = file.Workshops.find(workshop => workshop.id === req.params.wid);
         list.subscribers = list.subscribers.filter(e => e !== req.params.id);
         fs.writeFileSync(__dirname+"/workshops_teilnehmer.json", JSON.stringify(file));
         console.log(file);
         console.log(req.params.id + " wurde erfolgreich aus " + req.params.wid + " gelöscht!");
         res.status(200);
         res.send(req.params.id + " wurde erfolgreich aus " + req.params.wid + " gelöscht!");
    });


// reg muss mit Indikator aufgerufen werden, was das Objakt für  einen Typ hat, um spätere ID festzulegen. type = int spiehe spw
var reg = function (JSONObj, type){
  var status;
  var list;
  var prefix;
  switch(type){
    case 1:
      status = 'workshop';
      prefix = 'ws';
      break;
    case 2:
      status = 'student';
      prefix = 'mi';
      break;
    case 3:
      status = 'prof';
      prefix = 'pf';
      break;
    case 4:
      status = 'msg';
      prefix = 'mg';
      break;
  };
  fs.access(__dirname+"/"+status+".json", fs.F_OK,function(err){
    if(!err){
      list = JSON.parse(fs.readFileSync(__dirname+"/"+status+".json"));
      if(list.indexOf(JSONObj)!= -1)return 0;
    }
    id_list = JSON.parse(fs.readFileSync(__dirname+"/id_list.json"));
    var counterIndex = id_list.findIndex(function(item){return item.status == status});
    id_list[counterIndex].id ++;
    JSONObj.id = prefix+id_list[counterIndex].id;
    fs.writeFileSync(__dirname+"id_list.json", JSON.stringify(id_list));
    list.push(JSONObj);
    fs.writeFile(__dirname+"/"+status+".json", JSON.stringify(list),function(err){
      if(!err){
        console.log(status +' erstellt!');
        return 1;
      }
      else return 0;
    });
  });
}

var rm = function (rmThis,JSONObj){
  var type=spw(rmThis);
  var file = JSON.parse(fs.readFileSync(__dirname+"/"+JSONObj));
  switch(type) {
    case 1:
        file.Workshops.forEach(function (workshop, index) {
          if (workshop.id === rmThis) {
            file.Workshops.splice(index, 1);
            fs.writeFileSync(__dirname+"/"+JSONObj, JSON.stringify(file));
            return 1;
          }
        });
        break;
    case 2:
        file.students.forEach(function (student, index) {
          if (student.id === rmThis) {
             file.students.splice(index, 1);
             fs.writeFileSync(__dirname+"/"+JSONObj, JSON.stringify(file));
             return 1;
          }
        })
        break;
    case 3:
        file.profs.forEach(function (prof, index) {
          if (prof.id === rmThis) {
            file.profs.splice(index, 1);
            fs.writeFileSync(__dirname+"/"+JSONObj, JSON.stringify(file));
            return 1;
          }
        })
        break;
    default:
  }
}
var spw = function (id){ //Workshop=1, Student=2, Prof=3, Nachricht=4
  if(id.indexOf("ws") != -1) return 1;
  else if (id.indexOf("mi") != -1) return 2;
  else if (id.indexOf("pf") != -1) return 3;
  else if (id.indexOf("mg") != -1) return 4;
  else return 0;
}

var getObjByID = function(file, id){
  return file.find(function(item){
    return item.id == id;
  });
}
var getIndexByID = function(file, id){
  return file.findIndex(function(item){
    return item.id == id;
  });
}

//für User-PUT-Methoden
var changeUser = function(user, change_user, index){
  if(user.name!= change_user.name){
  user.name = change_user.name;
  }
  if(spw(user.id)==2){
    console.log('hier wird ein Student geändert');
    //ändern spezieller Eigenschaften hier eintragen
  }
  else if (spw(user.id)==3){
    console.log('hier wird ein Professor geändert');
    //ändern spezieller Eigenschaften hier eintragen
  }
  return user;
}


app.listen(1337);
