const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcrypt');

const app = express();
const port = 8080;

// set up the database to the MySQL database
const database = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'rootpass',
	database: 'blogdata'
});

const getTime = () => {
	let time = Date.now();
	let date = new Date(time);
	// get YYYY-MM-DD
	let day = date.getDate();
	let month = date.getMonth() + 1;
	let year = date.getFullYear();
	// get HH:MM:DD
	let hours = date.getHours();
	let minutes = date.getMinutes();
	let seconds = date.getSeconds();
	//return the datestamp formatted for an sql query
	return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// have express serve from the /dist directory
app.use(express.static(__dirname + '/dist'));

// have express parse json data
app.use(express.json());

// add a user to the database
app.post('/add_user', (req, res) => {
	res.send(JSON.stringify({'status':'user added'}));
})

const checkHashes = async (pass, hashword) => {
	return await new Promise((resolve, reject) => {
		bcrypt.compare(pass, hashword, (err, hash) => {
			// return the hashed password
			if (err) reject(err);
			resolve(hash);
		});
	});
}

const getHashword = async (user) => {
	const CMD = `SELECT * FROM users WHERE username='${user}'`;
	return await new Promise((resolve, reject) => {
		database.query(CMD, (err, rows) => {
			if (err) reject(err);
			// pull hashed password of the user if they exist
			(rows[0] == undefined) ? reject(new Error('User not found.')) : resolve(rows[0]['hashword']);
		});
	});
}

// log a user in to the application
app.post('/sign_in', async (req, res) => {
	console.log(req.body);
	const user = req.body.user;
	const pass = req.body.pass;
	// FIXME: be sure to sanitize inputs
	// sql command to retrieve 
	
	try {
		// try to get the user's password
		const hash = await getHashword(user);
		// compute the hash of the provided password
		const hashed = await checkHashes(pass, hash);
		console.log(hash);
		console.log(hashed);
		if (hashed) {
			// FIXME: user has been authenticated
			console.log('Passwords match.');
		} else {
			// FIXME: user's provided password doesn't match
			console.log('Passwords do not match.');
		}
	} catch(err) {
		// FIXME: user not in database
		// prompt them to make an account
		console.log("An error occurred: " + err);
	}
	
	res.send(JSON.stringify({'status':'logged in'}));
});

app.post('/make_post', (req, res) => {
	console.log('Making a blog post!');
	
	const current_time = getTime();
	database.query(`INSERT INTO blogposts (title, post, tags, datestamp, timestamp) VALUES ("Innovations in Quantum Computing", "The newest computing technology", "quantum computer", "${current_time}", "${current_time}")`, (err, rows) => {
		if (err) throw err;
		console.log('Data received:\n' + rows);
	});
	res.send(JSON.stringify({"response":"Blog post made!"}));
});

app.get('/', (req, res) => {
	res.render('index');
});

app.listen(port, () => {
	console.log('Listening on port ' + port);
})
