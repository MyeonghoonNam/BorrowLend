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

// app.use(static(__dirname));

// DB 정의 및 연결
var database;
var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

var UserSchema;
var SchoolSchema;
var ProductSchema;
var BoardSchema;

var UserModel;
var SchoolModel;
var ProductModel;
var BoardModel;

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
      LikeProduct:[{type:mongoose.Schema.Types.ObjectId, ref:'product'}]
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
      price_check:{type : String, 'default':'0'},
      content:{type : String, required : true},
      list:[new mongoose.Schema({name:{type : String, required : true, unique : true}})],
      userinfo:{type:mongoose.Schema.Types.ObjectId, ref:'users'},
      created_at: {type: Date, index: {unique: false}, 'default': Date.now},
      LikeCount:{type : Number, 'default':0}
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


    BoardSchema = mongoose.Schema({
      key:{type : Number, unique : true, 'default':0},
      number:{type : Number, 'default':0, max:50},
      title:{type : String, required : true},
      content:{type : String, required : true},
      usid:{type : String, required : true},
      userinfo:{type:mongoose.Schema.Types.ObjectId, ref:'users'},
      created_at: {type: Date, index: {unique: false}, 'default': Date.now}
    });

    BoardSchema.plugin(autoIncrement.plugin, {
      model:'BoardModel',
      field: 'key',
      startAt:1,
      increment:1
    });

    BoardSchema.plugin(autoIncrement.plugin, {
      model:'BoardModel',
      field: 'number',
      startAt:1,
      increment:1
    });

    BoardSchema.static('findByKey', function(key, callback){
      return this.find({key:key}, callback);
    });

    BoardSchema.static('findAll', function(callback){
      return this.find({}, callback);
    });

    console.log('UserSchema Define');
    console.log('SchoolSchema Define');
    console.log('ProductSchema Define');
    console.log('BoardSchema Define');
    
    UserModel = mongoose.model('users', UserSchema);
    SchoolModel = mongoose.model('schools', SchoolSchema);
    ProductModel = mongoose.model('product', ProductSchema);
    BoardModel = mongoose.model('Board', BoardSchema);
    
    console.log('UserModel Define');
    console.log('SchoolModel Define');
    console.log('ProductModel Define');
    console.log('BoardModel Define');

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
var addProduct = function(database, title, price, content, list, userid, check, callback){

  UserModel.findById(userid, function(err, result){
    var userinfo = result;

    var product = new ProductModel({
      "title":title,
      "price":price,
      "content":content,
      "list":list,
      "userinfo":userinfo[0]._id,
      "price_check":check
    });
    
    product.save(function(err){
      if(err) throw err;
          
      callback(null, product);
    });
  });

};
//

// 게시판 등록
var addBoard = function(database, title, content, userid, callback){

  UserModel.findById(userid, function(err, result){
    var userinfo = result;

    var board = new BoardModel({
      "title":title,
      "content":content,
      "userinfo":userinfo[0]._id,
      "usid":userinfo[0].id
    });
    
    board.save(function(err){
      if(err) throw err;
          
      callback(null, board);
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
              _id:docs[0]._doc._id,
              id:docs[0]._doc.id,
              name:docs[0]._doc.name,
              grade:docs[0]._doc.grade,
              LikeProduct:docs[0]._doc.LikeProduct,
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
  
        results = results.solt({created_at:1});
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
    ProductModel.find().sort({created_at:-1}).exec(function(err,results){
      if(results){
        var setToken = "0";
        
        res.render('./pages/store.html', {
          user:req.session.user,
          product:results,
          setToken:setToken
        });
      } else {
        res.redirect('/');
      }
    })
  }
});

app.get('/store/search', function(req,res){
  var word = req.query.search_word;
  
  ProductModel.find({title:{$regex:word}}).exec(function(err, results){
    if(results){
      var setToken = "3"
        res.render('./pages/store.html', {
          user:req.session.user,
          product:results,
          setToken:setToken
        });
    } else {
      res.redirect('/');
    }
  })
});

app.post('/store', function(req,res){
  if(req.session.user){
    var token = req.body.store_ordertoken;

    if(token == "1"){
      ProductModel.find({}).sort({LikeCount:-1, created_at:-1}).exec(function(err,results){
        if(results){
          var setToken = "1"
          res.render('./pages/store.html', {
            user:req.session.user,
            product:results,
            setToken:setToken
          });
        }
      })
    } else if(token == "0"){
      res.redirect('/store');
    }
  }
});

app.get('/product', function(req,res){

  var index = req.query.element_token;

  if(req.session.user){
    ProductModel.findByKey(index, function(err, result){
      if(err) throw err;
      if(result){
        console.log(result[0].userinfo)
        UserModel.findByOid(result[0].userinfo, function(err, doc){
          console.log(doc);
          UserModel.findById(req.session.user.id, function(err, doc2){
            var count = 0;
            if(doc2[0]._doc.LikeProduct.includes(result[0]._id)){
              count = 1;
            } 

            res.render('./pages/product.html', {
              user:req.session.user,
              product:result,
              userinfo:doc,
              SetLikecount:count
            });
          });
        })
      }
      
    });
  }
});

app.post('/product_like', function(req,res){
  var btn = req.body.count;
  var token = req.body.key;
  var uid = req.body.uid;
  
  UserModel.findById(uid, function(err, doc1){
    ProductModel.find({_id:token}, function(err, doc2){
      if(btn === "0"){
        var query = {_id:doc1[0]._id};
        var update = {$push:{LikeProduct:doc2[0]._id}};
  
        UserModel.findOneAndUpdate(query, update, {new:true, upsert: true}, function(err, result){
          console.log(result);
        });
  
        var query2 = {_id:doc2[0]._id};
        var update2 = {LikeCount:doc2[0].LikeCount + 1};

        ProductModel.findOneAndUpdate(query2, update2, {new:true, upsert: true}, function(err, result){
          console.log(result);
        });
        
        btn = "1";
        res.send({btn:btn});
      } else {
        var query = {_id:doc1[0]._id};
        var update = {$pull:{LikeProduct:doc2[0]._id}};
        
        UserModel.findOneAndUpdate(query, update, {new:true, upsert: true}, function(err, result){
          console.log(result);
        });
  
        var query2 = {_id:doc2[0]._id};
        var update2 = {LikeCount:doc2[0].LikeCount - 1};

        ProductModel.findOneAndUpdate(query2, update2, {new:true, upsert: true}, function(err, result){
          console.log(result);
        });
        btn ="0";
        res.send({btn:btn});
      }
    });
  });
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
  var check = req.body.price_check;
  
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
    
    addProduct(database, title, price, content, list, userid, check, function(err, docs){
      if(err) throw err;

      if(docs) {
        res.redirect('/store');
      }
    });
  }

});

app.get('/product_update', function(req,res){
  var uptoken = req.query.element_uptoken;

  ProductModel.findByKey(uptoken, function(err,doc){
    res.render('./pages/product_update.html', {
      user:req.session.user,
      product:doc
    })
  })
});

app.post('/product_update', upload.array('photo', 5), function(req,res){
  var uptoken = req.body.prtup_token;
  var title = req.body.title;
  var price = req.body.price;
  var content = req.body.content;
  var check = req.body.price_check;
  
  if(check == null){
    check = "0";
  }

  var list = new Array();
  
  var files = req.files;
  
  if(!files){
    var upquery = {_id:uptoken};
    var proupdate = {
      title:title,
      price:price,
      price_check:check,
      content:content,
    };
    
    ProductModel.findOneAndUpdate(upquery, proupdate, {new:true, upsert: true}, function(err, result){
      console.log(result);
      res.redirect('/service-rent');
    });
  } else {
    var originalname = '';
    var filename = '';
    var mimetype = '';
    var size = 0;

    for(var index = 0; index < files.length; index++){
      originalname = files[index].originalname;
      filename = files[index].filename;
      mimetype = files[index].mimetype;
      size = files[index].size;
      list[index] = {name:filename};
    }

    var upquery = {_id:uptoken};
    var proupdate = {
      title:title,
      price:price,
      price_check:check,
      content:content,
      list:list
    };

    ProductModel.findOneAndUpdate(upquery, proupdate, {new:true, upsert: true}, function(err, result){
      console.log(result);
      res.redirect('/service-rent');
    });
  }
});

app.post('/product_delete', function(req,res){
  if(req.session.user){
    var deltoken = req.body.element_deltoken;

    ProductModel.findByKey(deltoken, function(err, doc){
      console.log(doc[0]._id);
      ProductModel.deleteOne({_id:doc[0]._id}, function(err, results){
        UserModel.find({}, function(err, docs){
          for(var i=0; i<docs.length; i++){
            var query = {_id:docs[i]._id};
            var update = {$pull:{LikeProduct:doc[0]._id}};
            
            UserModel.findOneAndUpdate(query, update, {new:true, upsert: true}, function(err, result){
            });
          }
          res.redirect('/service-rent');
        });
      });
    });
  }
});

app.get('/service-rent', function(req,res){
  if(req.session.user){
    ProductModel.find({userinfo:req.session.user._id}).sort({created_at:-1}).exec(function(err,results){
      if(err) throw err;

      if(results){
        res.render('./pages/service-rent.html',{
          user:req.session.user,
          product:results
        })
      }
    })
  } else{
    res.redirect('/');
  }
});

app.get('/service-like', function(req,res){
  if(req.session.user){
    UserModel.find({id:req.session.user.id}, function(err, doc){
      ProductModel.find({_id:doc[0].LikeProduct}, function(err, results){
        console.log(results);
        res.render('./pages/service-like.html',{
          user:req.session.user,
          product:results
        })
      })
    })
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
    BoardModel.find().sort({created_at:-1}).exec(function(err,results){
      if(results){
        var setToken = "0";

        res.render('./pages/customer-q&a.html', {
          user:req.session.user,
          board:results,
          setToken:setToken
        });
      } else {
        res.redirect('/');
      }
    })
  }
});

app.get('/q&a-element', function(req,res){
  
  var index2 = req.query.board_element_token;

  if(req.session.user){
    BoardModel.findByKey(index2, function(err, result){
      if(err) throw err;
      if(result){
        console.log(result[0].userinfo)
        UserModel.findByOid(result[0].userinfo, function(err, doc){
          console.log(doc);
          res.render('./pages/q&a-element.html', {
              user:req.session.user,
              board:result,
              userinfo:doc
          });
        })
      } 
    });
  }
});

app.get('/customer-write', function(req,res){
  if(req.session.user){
    res.render('./pages/customer-write.html', {user:req.session.user});
  } else{
    res.redirect('/');
  }
});

app.post('/customer-write', function(req,res){
  var title = req.body.title;
  var content = req.body.content;
  var userid = req.session.user.id;

  addBoard(database, title, content, userid, function(err, docs){
    if(err) throw err;

    if(docs) {
      res.redirect('customer-q&a');
    }
  });
});


app.get('/honor', function(req,res){
  if(req.session.user){
    UserModel.find().sort({created_at:-1}).exec(function(err,results){
      if(results){

        res.render('./pages/honor.html', {
          user:req.session.user,
          honor:results,
        });
      } else {
        res.redirect('/');
      }
    })
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
// 아이디찾기 
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

// 비밀번호 찾기
var authUser3 = function(database, id, name, callback){
  console.log('authUser 호출 : ' + id, + ', ' + name);

  UserModel.findById(id, function(err, results) {
		if (err) {
			callback(err, null);
			return;
		}
		
		console.log('아이디 [%s]로 사용자 검색결과', id);
		console.dir(results);
		
		if (results.length > 0) {
			console.log('아이디와 일치하는 사용자 찾음.');
			
			if (results[0]._doc.name === name) {
				console.log('이름 일치함');
				callback(null, results);
			} else {
				console.log('이름 일치하지 않음');
				callback(null, null);
			}
			
		} else {
	    	console.log("아이디와 일치하는 사용자를 찾지 못함.");
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

app.get('/findPS', function(req,res){
  if(req.session.user){
    res.redirect('/findPSresult');
  } else{
    res.render('./pages/findPS.html');
  }
});

app.post('/findPS', function(req,res){
  console.log('Access to login louter');

  var paramId = req.body.id;
  var paramName = req.body.name;

  if(req.session.user) {
    
  } else{
      if(database){
        authUser3(database, paramId, paramName, function(err, docs){
          if(err) throw err;
    
          if(docs){
            req.session.user = {
              id:docs[0]._doc.id,
              password:docs[0]._doc.password,
              grade:docs[0]._doc.grade,
              tel:docs[0]._doc.tel,
              // product:docs[0]._doc.product,
              authorized:true
            }

            console.log(docs[0]._doc.name);
            
            res.render('./pages/findPSresult.html', {user:req.session.user});
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


app.get('/findPSresult', function(req,res){
  if(req.session.user){
    res.render('./pages/findPSresult.html', {user:req.session.user});
  } else{
    res.redirect('/findPS');
  }
});


//--------------------------------------------------------//