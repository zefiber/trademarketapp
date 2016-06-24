

var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.set('etag', false);
app.use(bodyParser.json());



var mongoose = require('mongoose');
var db = 'mongodb://localhost/example';
mongoose.connect(db);
var Book = require('./model/Book.model');
var Client = require('./model/Client.model');
var ClientTest = require('./model/ClientTest.model');
var port = 8200;



//test express js start
app.listen(port,function(){
	console.log('app listening on port' + port);
});



app.post('/signup', function(req,res){
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

	console.log(req.body);
	var reqBody = req.body;
	var client = new Client();

	client.username = reqBody.username;
	client.password = reqBody.password;
	client.email = reqBody.email;
	console.log(client);
	client.save(function(err,client){
		if(err){
			res.send('error saving');
		}else{
			console.log(client);
			res.send(client);
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



module.exports = app;




