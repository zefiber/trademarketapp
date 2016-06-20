//CORS middleware
var allowCrossDomain = function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

	next();
};

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();
var http = require('http').Server(app);

var mongoose = require('mongoose');
var db = 'mongodb://localhost/example';
mongoose.connect(db);
var Book = require('./model/Book.model');
var Client = require('./model/Client.model');
var ClientTest = require('./model/ClientTest.model');
var port = 8080;



//test express js start
app.listen(port,function(){
	console.log('app listening on port' + port);
});



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(allowCrossDomain);
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//app.use('/', routes);
//app.use('/users', users);
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
extended:true
}));

app.get('/signup', function(req,res){
	// var client = new Client();
	// client.username = req.body.username;
	// client.password = req.body.password;
	// client.lastname = req.body.lastname;
	// client.firstname = req.body.firstname;
	// client.email = req.body.email;
	// client.save(function(err,client){
	// 	if(err){
	// 		res.send('error saving client');
	// 	}else{
	// 		console.log(client);
	// 		res.send(client);
	// 	}
	// })
	var clientTest = new ClientTest();
	clientTest.username = req.username;
	clientTest.password = req.password;
	clientTest.save(function(err,clientTest){
		if(err){
			res.send('error');
		}else{
			res.send(clientTest);
		}
	})
});

app.post('/book2',function(req,res){
	Book.create(req.body, function(err,book){
		if(err){
			res.send('error saveing book');
		}else{
			console.log(book);
			res.send(book);
		}
	})
})

app.put('/book/:id',function(req,res){
	Book.findOneAndUpdate({
		_id:req.params.id},
		{$set:{title:req.body.title}},
			{update:true},
			function(err,newBook){
			if(err){
				console.log('error occured');
			}else{
				console.log(newBook);
				res.send(newBook);
			}
			});
	});


app.get('/zetest',function(req,res){

	var clientTest = new ClientTest();
	clientTest.username = 'ze';
	clientTest.password = 'zzz';
	clientTest.save(function(err,book){
		if(err){
			res.send('error');
		}else{
			res.send('happy to be here:'+clientTest);
		}
	})

});

app.get('/books',function(req,res){
	console.log('getting all books');
	Book.find({})
	.exec(function(err,books){
		if(err){
		res.send('error has occured');
		}else{
		console.log(books);
		res.json(books);
		}
	})
});

app.get('/books/:id', function(req, res){
	console.log('getting one book');
	Book.findOne({
	_id:req.params.id
	})
	.exec(function(err,book){
		if(err){
			res.send('error occured');
		}else{
			console.log(book);
			res.json(book);
		}
	})
})


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;




