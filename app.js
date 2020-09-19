var express = require('express');
var http = require('http');
var path = require('path');

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var static = require('serve-static');
var fs = require('fs');

var expressSession = require('express-session');

var app = express();

app.set('port', process.env.PORT || 3000);

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(expressSession({
  secret:'Key',
  resave:true,
  saveUninitialized:true
}));

// DB 정의 및 연결
var database;
var mongoose = require('mongoose');
var UserSchema;
var UserModel;

function connectDB(){
  var databaseUrl = 'mongodb://localhost:27017/local';

  console.log('Try connect to db');

  mongoose.Promise = global.Promise;
  mongoose.connect(databaseUrl);
  database = mongoose.connection;

  database.on('error', console.log.bind(console, 'mongoose connection error'));

  database.on('open', function(){
    console.log('db connect Success : ' + databaseUrl);

    UserSchema = mongoose.Schema({
      id : String,
      name : String,
      passwod : String
    });

    UserSchema.static('findById', function(id, callback){
      return this.find({id:id}, callback);
    })

    console.log('UserSchema Definition');

    UserModel = mongoose.model('users', UserSchema);
    console.log('UserModel Definition');
  });

  database.on('disconnected', function(){
    console.log('연결종료. 5초 후 다시 연결.');
    setInterval(connectDB, 5000);
  });
}
//

// User 조회
var authUser = function(database, id, password, callback){
  console.log('authUser 호출 : ' + id, + ', ' + password);

  UserModel.findById(id, function(err, results) {
		if (err) {
			callback(err, null);
			return;
		}
		
		console.log('아이디 [%s]로 사용자 검색결과', id);
		console.dir(results);
		
		if (results.length > 0) {
			console.log('아이디와 일치하는 사용자 찾음.');
			
			if (results[0]._doc.password === password) {
				console.log('비밀번호 일치함');
				callback(null, results);
			} else {
				console.log('비밀번호 일치하지 않음');
				callback(null, null);
			}
			
		} else {
	    	console.log("아이디와 일치하는 사용자를 찾지 못함.");
	    	callback(null, null);
	    }
		
	});
};
//

app.get('/', function(req,res){
  res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});

  fs.readFile('index.html', function(err, data){
    if(err) throw err;

    res.end(data);
  });
})

app.use(static(__dirname));

http.createServer(app).listen(app.get('port'), function(){
  console.log('Connecting Server..');
})