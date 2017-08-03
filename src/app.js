const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { Client } = require('pg');
const SQL = require('sql-template-strings');

//setting all the required pug files and static files, starting body-parser
app.set('views', __dirname + '/views');
app.set('view engine', 'pug');
app.use(express.static(__dirname + '/../public'));
app.use(bodyParser.urlencoded({ extended: true }));

//setting up the client
const client = new Client({
	database: 'bulletinboard',
	host: 'localhost',
	user: process.env.POSTGRES_USER,
	password: process.env.POSTGRES_PASSWORD
});
client.connect();

//render the homepage which is also the add messages form
app.get ('/', (req,res) => {
	res.render('index');
})

//post request to add new messages to the database
app.post ('/submitMessage', (req,res) => {
	let newTitle = req.body.title;
	let newBody = req.body.body;
	client.query(SQL`insert into messages (title, body) values (${newTitle}, ${newBody})`, (err, result) => {
			console.log(err ? err.stack : 'new message added to the database')
	});
	res.redirect('/messages');
});

app.get ('/messages', (req,res) => {
	client.query('select * from messages', (err, result) => {
		console.log(result.rows);
		if (err){
			throw err;
		}
		res.render('messages', {messages: result.rows});
	})
});

app.listen(3000, () => {
	console.log('App listening on port 3000!');
})
