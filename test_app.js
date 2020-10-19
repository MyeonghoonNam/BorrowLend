var express = require('express');
var http = require('http');
var path = require('path');

var static = require('serve-static');
var ejs = require('ejs');

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var static = require('serve-static');

var fs = require('fs');
var cors = require('cors');

var ejs = require('ejs');

var app = express();

var expressSession = require('express-session');


app.set('port', process.env.PORT || 3000);


app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use(cookieParser());

app.use(cors());

// app.set('views', path.join(__dirname,'views'));
// app.engine('html', require('ejs').renderFile);
// app.set('view engine','html');
app.use(static(__dirname));

app.get('/', function(req,res){
  res.redirect('./test.html');
});

app.post('/pos', function(req,res){
  var test = req.body.testinput;
  // var testhi = req.body.hi;
  console.log(test);
  fs.readFile('./test.html', 'utf-8',function(err,data){
    res.send(ejs.render(data,{
      result:test[0]
    }));
 });
});

app.post('/test', function(req,res){
  var token = req.body.token;
  console.log(token);
  console.log("hi");
  res.end();
})

http.createServer(app).listen(app.get('port'), function(){
  console.log('Connecting Server..');
})