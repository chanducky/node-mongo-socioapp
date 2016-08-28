var express = require('express');
var bodyParser = require('body-parser');
var mongojs = require('mongojs');

var app = express();
var path= require('path');

/* setup view  engine*/
 app.set('view engine','ejs');
 app.set('views',path.join(__dirname,'views'));

 app.use(bodyParser.json());
 app.use(bodyParser.urlencoded({extended:false}));

/* mongo connection */
var db = mongojs('db');
db.on('error', function (err) {
    console.log('database error', err)
})
 
db.on('connect', function () {
    console.log('database connected')
})

var mycollection = db.collection('posts')

// show all record
app.get('/', function(req, res){
	var posts = new Array() ;
	mycollection.find(function(err,docs){
		console.log(' all docs in mongo = ' +JSON.stringify(docs));
		posts = docs;
		
		res.render('index', {'agent_name': 'chandu', 'posts':posts,'post': [],'opr':'save'});
	});
});

// add record 
app.post('/posts/add', function(req, res){

	 console.log(' soial app = ' + req.body.social_app);
	 var post={
		 social_app : req.body.social_app,
		 media_type : req.body.media_type,
		 posted_by : req.body.posted_by
	 };

mycollection.insert(post,function(err, result){
	console.log(' error after save '+err);
	console.log(' result after save ' + result);
})

	 res.redirect("/");
});

// delete 
app.get('/posts/delete/:postId', function(req, res){	
	mycollection.remove( {"_id":db.ObjectId(req.params.postId)}, function(err, result){
		console.log(' error after delete '+err);
		console.log(' result after delete ' + JSON.stringify(result));
		 res.redirect("/");
	});
});

// edit
app.get('/posts/edit/:postId', function(req, res){
	
	mycollection.findOne( {"_id":db.ObjectId(req.params.postId)}, function(err, doc){
		console.log(' result after edit ' + JSON.stringify(doc));
		
		 res.render("index", {'agent_name': 'chandu', 'post' : doc, 'posts':[], 'opr':'edit'} );
	});
});


// update 
app.post('/posts/update', function(req, res){

	console.log(' in update ..'+req.body.postId);
	 var post={
		 social_app : req.body.social_app,
		 media_type : req.body.media_type,
		 posted_by : req.body.posted_by
	 };

	mycollection.update({_id: db.ObjectId(req.body.postId) },{ $set:post} ,function(err, result){
		console.log(' error after update '+err);
		console.log(' result after update ' + result);
		res.redirect("/");
	});

});


app.listen(3000,function(){
	console.log(' server is listening on port 3000');
});

