var express = require('express');
var http = require('http');
var path = require('path');

var static = require('serve-static');
var ejs = require('ejs');


var app = express();

app.set('port', process.env.PORT || 3000);

app.set('views', path.join(__dirname,'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine','html');

app.get('/', function(req,res){
  res.render('test', {title:'Express'});
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Connecting Server..');
})