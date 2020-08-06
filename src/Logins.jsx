import React from 'react';
import ReactDOM from 'react-dom';

function SignIn() {

	const getCredentials = () => {
		// get username and password from the input fields
		const user = document.getElementById('username');
		const pass = document.getElementById('password');
		//FIXME: check for null/malicious input
		// check if user is in database
		authenticateUser(user, pass);
	}

	const authenticateUser = (username, password) => {
		console.log(username.value);
		console.log(password.value);
		

		fetch('/sign_in', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({"user": username.value, "pass": password.value})})
			.then(resp => { return resp.json() })
			.then(json => console.log(json));
		console.log('User authenticated');
	}

	return (<div id='signinWrapper'>
		<input id='username' type='text' placeholder='Enter your username here.'/>
		<input id='password' type='text' placeholder='Enter your password here.'/>

		<button id='submit' onClick={() => getCredentials()}>Sign In</button>
	</div>);
}

function SignUp() {

	const getCredentials = () => {
		// get username and password from the input fields
		const user = document.getElementById('username');
		const pass = document.getElementById('password');
		const pass2 = document.getElementById('password2');
		const email = document.getElementById('email');
		if (pass.value !== pass2.value) {
			alert('Passwords do not match!');
			return;
		}
		//FIXME: check for null/malicious input
		authenticateUser(user, pass, email);
	}

	const authenticateUser = (username, password, email) => {
		console.log(username.value);
		console.log(password.value);
		fetch('/sign_up', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({"user": username.value, "pass": password.value, "email": email.value})})
			.then(resp => { return resp.json() })
			.then(json => console.log(json));
		console.log('User authenticated');
	}

	return (<div id='signinWrapper'>
		<input id='username' type='text' placeholder='Enter your username here.'/>
		<input id='password' type='text' placeholder='Enter your password here.'/>
		<input id='password2' type='text' placeholder='Re-enter your password here.'/>
		<input id='email' type='text' placeholder='Enter your email here.'/>
		<button id='submit' onClick={() => {
			// get credentials and send them to the server
			getCredentials();
			// FIXME: 
			// if we added a user, return to the sign in page to sign in
			RenderSignIn();
		}}>Sign Up</button>
	</div>);
}

const RenderSignIn = () => {
	ReactDOM.render(<SignIn/>, document.getElementById('root'));
}

const RenderSignUp = () => {
	ReactDOM.render(<SignUp/>, document.getElementById('root'));
}

export {
	SignIn,
	SignUp
}
