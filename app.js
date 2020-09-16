var express = require('express');
var http = require('http');
var path = require('path');

var static = require('serve-static');
var fs = require('fs');

var app = express();

app.set('port', process.env.PORT || 3000);

app.use('/', static(__dirname));
app.get('/', function(req,res){
  res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});

  fs.readFile('./index.html', function(err, data){
    if(err) throw err;

    res.end(data);
  })
})

http.createServer(app).listen(app.get('port'), function(){
  console.log('Connecting Server..');
})