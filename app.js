var express = require('express');
var app = express();
var mysql = require('mysql');
var bodyParser = require('body-parser'); 
var session = require('express-session');

var globaluser = "null";

function setglobal(a){
	globaluser = a;
};

app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'crypto'
})

connection.connect(function(err){
    if (err) throw err;
    console.log("connected to database!");
})

app.get('/', function(req, res) {
    res.render('home.ejs');
})

app.post('/auth', function(req, res) {
	var username = req.body.username;
	var password = req.body.password;
	if (username && password) {
		connection.query('SELECT * FROM user WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
			if (results.length > 0) {
				req.session.loggedin = true;
				req.session.username = username;
				res.redirect('/login');
			} else {
				res.send('Incorrect Username and/or Password!');
			}			
			res.end();
		});
	} else {
		res.send('Please enter Username and Password!');
		res.end();
	}
	setglobal(username);
	console.log(globaluser);
});

app.get('/login', function(req, res){
    if (req.session.loggedin) {
		res.render("login.ejs");
	} else {
		res.send('Please login to view this page!');
	}
	res.end();
})

app.post("/view_message", function(req, res){
	username = globaluser;
	connection.query("SELECT user_from AS sender , message FROM messages WHERE user_to = ?" , [username], function(err, results){
		// if (err) throw err;
		if (results.length > 0) {
			var sender = results[0].sender;
			var message = results[0].message;
			res.render("view_message", {sender: sender , message: message})
		}
		else {
			res.send("no messages!");
		}
	})
	res.end();
})

app.post("/send_message", function(req, res){
	res.render("send_message.ejs");
})

app.listen(8080, function(){
    console.log("connected on localhost:8080")
})

