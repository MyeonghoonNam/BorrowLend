var express = require('express');
var http = require('http');
var path = require('path');

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var static = require('serve-static');

var fs = require('fs');
var multer = require('multer');
var cors = require('cors');

var ejs = require('ejs');


var expressSession = require('express-session');

var app = express();

app.set('port', process.env.PORT || 3000);

app.set('views', path.join(__dirname,'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine','html');

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use(cookieParser());

app.use(expressSession({
  secret:'Key',
  resave:true,
  saveUninitialized:true
}));

app.use(cors());

//multer 설정
var storage = multer.diskStorage({
  destination:function(req, file, callback){
    callback(null, './src/uploads')
  },
  filename:function(req, file, callback){
    callback(null, Date.now() + file.originalname);
  }
});

var upload = multer({
  storage:storage,
  limits:{
    files:5,
    fileSize:10*1024*1024
  }
});
//

// DB 정의 및 연결
var database;
var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

var UserSchema;
var SchoolSchema;
var ProductSchema;

var UserModel;
var SchoolModel;
var ProductModel;

function connectDB(){
  var databaseUrl = 'mongodb://localhost:27017/local';

  console.log('Try connect to db');

  mongoose.Promise = global.Promise;
  mongoose.connect(databaseUrl, {
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex:true,
    useFindAndModify:false
  });
  database = mongoose.connection;
  autoIncrement.initialize(database);

  database.on('error', console.log.bind(console, 'mongoose connection error'));

  database.on('open', function(){
    console.log('DB connect Success : ' + databaseUrl);

    UserSchema = mongoose.Schema({
      id : {type : String, required : true, unique : true},
      password : {type : String, required : true},
      name : {type : String, required : true},
      gender : {type : String, required : true},
      school : {type : String, required : true},
      tel : {type : String, required : true},
      created_at: {type: Date, index: {unique: false}, 'default': Date.now},
      grade : {type : String, 'default':'시민'},
      // product : [ProductSchema]
    });

    UserSchema.static('findByOid', function(oid, callback){
      return this.find({_id:oid}, callback);
    });

    UserSchema.static('findById', function(id, callback){
      return this.find({id:id}, callback);
    });

    UserSchema.static('findById2', function(tel, callback){
      return this.find({tel:tel}, callback);
    });

    UserSchema.static('findAll', function(callback){
      return this.find({}, callback);
    });

    SchoolSchema = mongoose.Schema({
      name: {type : String, required : true, unique : true}
    });

    SchoolSchema.static('findAll', function(callback){
      return this.find({}, callback);
    });

    ProductSchema = mongoose.Schema({
      key:{type : Number, unique : true, 'default':0},
      title:{type : String, required : true},
      price:{type : String, required : true},
      content:{type : String, required : true},
      list:[new mongoose.Schema({name:{type : String, required : true, unique : true}})],
      userinfo:{type:mongoose.Schema.Types.ObjectId, ref:'users'}
    });

    ProductSchema.plugin(autoIncrement.plugin, {
      model:'ProductModel',
      field: 'key',
      startAt:1,
      increment:1
    });

    ProductSchema.static('findByKey', function(key, callback){
      return this.find({key:key}, callback);
    });

    ProductSchema.static('findAll', function(callback){
      return this.find({}, callback);
    });

    console.log('UserSchema Define');
    console.log('SchoolSchema Define');
    console.log('ProductSchema Define');
    
    UserModel = mongoose.model('users', UserSchema);
    SchoolModel = mongoose.model('schools', SchoolSchema);
    ProductModel = mongoose.model('product', ProductSchema);
    
    console.log('UserModel Define');
    console.log('SchoolModel Define');
    console.log('ProductModel Define');

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

// User 등록

var addUser = function(database, id, password, name, gender, school, tel, callback){
  var user = new UserModel({
    "id":id,
    "password":password,
    "name":name,
    "gender":gender,
    "school":school,
    "tel":tel
  });

  user.save(function(err){
    if(err) throw err;

    callback(null, user);
  });
};
//

// 물품 등록
var addProduct = function(database, title, price, content, list, userid, callback){

  UserModel.findById(userid, function(err, result){
    var userinfo = result;

    var product = new ProductModel({
      "title":title,
      "price":price,
      "content":content,
      "list":list,
      "userinfo":userinfo[0]._id
    });
    
    product.save(function(err){
      if(err) throw err;
          
      callback(null, product);
    });
  });

};
//

app.get('/', function(req,res){
  if(req.session.user){
    res.redirect('/main');
  } else{
    res.render('./index.html');
  }
});

app.get('/main', function(req,res){
  if(req.session.user){
    res.render('./pages/main.html', {user:req.session.user});
  } else {
    res.redirect('/');
  }
});

app.post('/main', function(req,res){
  console.log('Access to login louter');

  var paramId = req.body.id;
  var paramPassword = req.body.password;

  if(req.session.user) {
    
  } else{
      if(database){
        authUser(database, paramId, paramPassword, function(err, docs){
          if(err) throw err;
    
          if(docs){
            req.session.user = {
              id:docs[0]._doc.id,
              name:docs[0]._doc.name,
              grade:docs[0]._doc.grade,
              // product:docs[0]._doc.product,
              authorized:true
            }

            console.log(docs[0]._doc.name);
            
            res.render('./pages/main.html', {user:req.session.user});
          }
        });
      } else {
        res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
        res.write('<h2>데이터베이스 연결 실패</h2>');
        res.write('<div><p>데이터베이스에 연결하지 못했습니다.</p></div>');
        res.end();
      }  
  }
});

app.get('/signup', function(req,res){
  if(req.session.user){
    res.redirect('./main');
  } else{
    if(database){
      SchoolModel.findAll(function(err,results){
  
        if(err) throw err;
  
        if(results){
          res.render('./pages/signup.html', {results:results});
        }
      });
    }
  }
});

app.post('/signup', function(req,res){
  var paramId = req.body.id;
  var paramPassword = req.body.password;
  var paramName = req.body.name;
  var paramGender = req.body.gender;
  var paramSchool = req.body.school;
  var paramTel = req.body.tel;

  if(database) {
    addUser(database, paramId, paramPassword, paramName, paramGender, paramSchool, paramTel, function(err, docs){
      if(err) throw err;
      
      console.log("사용자 추가 성공.");
      //signup.html에서 알림창 확인 후 인덱스 페이지 이동.
    });
  };
});

app.get('/store', function(req,res){
  if(req.session.user){
    ProductModel.findAll(function(err,results){
      if(err) throw err;

      if(results){
        res.render('./pages/store.html', {
          user:req.session.user,
          product:results
        });
      }
    });
  } else{
      res.redirect('/');
  }
});

app.post('/product', function(req,res){

  var index = req.body.element_token;

  if(req.session.user){
    ProductModel.findByKey(index, function(err, result){
      if(err) throw err;
      
      if(result){
        console.log(result[0].userinfo)
        UserModel.findByOid(result[0].userinfo, function(err, doc){
          console.log(doc);

          res.render('./pages/product.html', {
            user:req.session.user,
            product:result,
            userinfo:doc
          });
        })
      }
      
    });
  }
});

app.get('/product-upload', function(req,res){
  if(req.session.user){
    res.render('./pages/product-upload.html', {user:req.session.user});
  } else{
    res.redirect('/');
  }
});

app.post('/product-upload', upload.array('photo', 5) ,function(req,res){
  var title = req.body.title;
  var price = req.body.price;
  var content = req.body.content;
  var list = new Array();
  var userid = req.session.user.id;
  
  var files = req.files;
  var originalname = '';
  var filename = '';
  var mimetype = '';
  var size = 0;

  if(Array.isArray(files)){
    for(var index = 0; index < files.length; index++){
      originalname = files[index].originalname;
      filename = files[index].filename;
      mimetype = files[index].mimetype;
      size = files[index].size;
      list[index] = {name:filename};
    }
    
    

    addProduct(database, title, price, content, list, userid, function(err, docs){
      if(err) throw err;

      if(docs) {
        res.redirect('/store');
      }
    });
  }

});

app.get('/service-rent', function(req,res){
  if(req.session.user){
    res.render('./pages/service-rent.html', {user:req.session.user});
  } else{
    res.redirect('/');
  }
});

app.get('/service-like', function(req,res){
  if(req.session.user){
    res.render('./pages/service-like.html', {user:req.session.user});
  } else{
    res.redirect('/');
  }
});
app.get('/message', function(req,res){
  if(req.session.user){
    res.render('./pages/message.html', {user:req.session.user});
  } else{
    res.redirect('/');
  }
});

app.get('/customer-notice', function(req,res){
  if(req.session.user){
    res.render('./pages/customer-notice.html', {user:req.session.user});
  } else{
    res.redirect('/');
  }
});

app.get('/customer-q&a', function(req,res){
  if(req.session.user){
    res.render('./pages/customer-q&a.html', {user:req.session.user});
  } else{
    res.redirect('/');
  }
});

app.get('/honor', function(req,res){
  if(req.session.user){
    res.render('./pages/honor.html', {user:req.session.user});
  } else{
    res.redirect('/');
  }
});

app.get('/userinfo', function(req,res){
  if(req.session.user){

  } else{
    res.redirect('/');
}
});

app.get('/logout', function(req,res){
  if(req.session.user){
    req.session.destroy(function(err){
      if(err) throw err;

      console.log('Success Logout');

      res.redirect('/');
    })
  } else{
    res.redirect('/');
  }
});

app.use(static(__dirname));
// app.use('/uploads', static(path.join(__dirname + '/src', 'uploads')));

http.createServer(app).listen(app.get('port'), function(){
  console.log('Connecting Server..');

  connectDB();
})

//------------------------------------------------------//
// 아이디찾기 - 휴대전화버전
var authUser2 = function(database, tel, name, callback){
  console.log('authUser 호출 : ' + tel, + ', ' + name);

  UserModel.findById2(tel, function(err, results) {
		if (err) {
			callback(err, null);
			return;
		}
		
		console.log('전화번호 [%s]로 사용자 검색결과', tel);
		console.dir(results);
		
		if (results.length > 0) {
			console.log('전화번호와 일치하는 사용자 찾음.');
			
			if (results[0]._doc.name === name) {
				console.log('이름 일치함');
				callback(null, results);
			} else {
				console.log('이름 일치하지 않음');
				callback(null, null);
			}
			
		} else {
	    	console.log("전화번호와 일치하는 사용자를 찾지 못함.");
	    	callback(null, null);
	    }
		
	});
};


app.get('/findID', function(req,res){
  if(req.session.user){
    res.redirect('/findIDresult');
  } else{
    res.render('./pages/findID.html');
  }
});


app.post('/findID', function(req,res){
  console.log('Access to login louter');

  var paramTel = req.body.tel;
  var paramName = req.body.name;

  if(req.session.user) {
    
  } else{
      if(database){
        authUser2(database, paramTel, paramName, function(err, docs){
          if(err) throw err;
    
          if(docs){
            req.session.user = {
              id:docs[0]._doc.id,
              name:docs[0]._doc.name,
              grade:docs[0]._doc.grade,
              tel:docs[0]._doc.tel,
              // product:docs[0]._doc.product,
              authorized:true
            }

            console.log(docs[0]._doc.name);
            
            res.render('./pages/findIDresult.html', {user:req.session.user});
          }
        });
      } else {
        res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
        res.write('<h2>데이터베이스 연결 실패</h2>');
        res.write('<div><p>데이터베이스에 연결하지 못했습니다.</p></div>');
        res.end();
      }  
  }
});

app.get('/findIDresult', function(req,res){
  if(req.session.user){
    res.render('./pages/findIDresult.html', {user:req.session.user});
  } else{
    res.redirect('/findID');
  }
});


//--------------------------------------------------------//