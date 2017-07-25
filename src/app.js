const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const { Client } = require('pg');

app.set('views', path.join(__dirname,'views'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'css')));
app.use(bodyParser.urlencoded({ extended: true }));

app.get ('/', (req,res) => {
	res.render('index');
})

// app.post ('/submitMessage', (req,res) => {
// 	client.connect();
// 	client.query('select * from messages', (err, res) => {
// 		console.log(err ? err.stack : res.rows);
// 		client.end();
// 	});
// })

app.get ('/messages', (req,res) => {
	const client = new Client({
		database: 'bulletinboard',
		host: 'localhost',
		user: process.env.POSTGRES_USER,
		password: process.env.POSTGRES_PASSWORD
	});
	client.connect();
	client.query('select * from messages', (err, result, done) => {
		// console.log(result.rows);
		if (err){
			throw err;
		}
		res.render('messages', {messages: result.rows});
		client.end();
  		.then(() => console.log('client has disconnected'))
  		.catch(err => console.error('error during disconnection', err.stack))
	})
});

app.listen(3000, () => {
	console.log('App listening on port 3000!');
})
