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

const checkForUser = async (user) => {
	const CMD = `SELECT * FROM users WHERE username='${user}'`;
	return await new Promise((resolve, reject) => {
		database.query(CMD, (err, rows) => {
			if (err) reject(err);
			// pull hashed password of the user if they exist
			(rows[0] == undefined) ? resolve(0) : resolve(1);
		});
	});
	
}

const computeHashword = async (pass) => {
	const rounds = 10;
	return await new Promise((resolve, reject) => {
		bcrypt.genSalt(rounds, (err, salt) => {
			if (err) reject(err);
			bcrypt.hash(pass, salt, (err, hash) => {
				if (err) throw err;
				resolve(hash);
			});
		});
	});
}

const addUser = async (user, pass, email) => {
	// compute a new salted hash
	const hashed = await computeHashword(pass);
	
	// create the sql query to add the user into the database
	const CMD = `INSERT INTO users (username, hashword, email) VALUES ("${user}", "${hashed}", "${email}");`;
	
	// add the user to the database
	database.query(CMD, (err, rows) => {
		if (err) throw err;
		console.log(`New user established: ${user}.`);
	});
}

app.post('/sign_up', async (req, res) => {
	// parse the submitted username, password, and email
	const { user, pass, email } = req.body;
	
	// check if the username is available
	const exists = await checkForUser(user);
	
	// add the user the the database if the provided name hasn't been taken
	exists ? res.send(JSON.stringify({'user':'unavailable'})) : addUser(user, pass, email);

	// return success upon user creation
	res.send(JSON.stringify({'user':'established'}));
});

// log a user in to the application
app.post('/sign_in', async (req, res) => {
	const { user, pass } = req.body;
	
	// FIXME: be sure to sanitize inputs
	
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

app.post('/add_post', (req, res) => {
	console.log('Making a blog post!');
	
	// get field data
	const {title, postbody, tags} = req.body;
	console.log(title);
	console.log(postbody);
	console.log(tags);
	// get the current time
	const current_time = getTime();
	// 
	const CMD = `INSERT INTO blogposts (title, post, tags) VALUES ("${title}", "${postbody}", "${tags}")`;

	database.query(CMD, (err, rows) => {
		if (err) throw err;
		console.log('Data received:\n' + rows);
	});
	res.send(JSON.stringify({"response":"Blog post made!"}));
});

app.get('/get_posts', (req, res) => {
	const CMD = `SELECT * FROM blogposts`;
	database.query(CMD, (err, rows) => {
		if (err) throw err;
		console.log(rows);
		res.send(JSON.stringify({"posts": rows}));
	});

});

app.get('/', (req, res) => {
	res.render('index');
});

app.listen(port, () => {
	console.log('Listening on port ' + port);
})
