import React from 'react';
import ReactDOM from 'react-dom';

function PostSelector({get}) {
	return (<div id='postselectorWrapper' onClick={() => get()}>
	<div id='postselector'>
	//FIXME: load posts from the database and display them here
	Selector
	</div>
	</div>);
}

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
		<input type='submit' onClick={() => getCredentials()}/>
	</div>);
}

function Heading() {
	return (<div id='heading'>
	<div id='loginbuttons'>
	<div id='signin' onClick={() => {
		console.log('signin');
		// render the sign in page
		RenderSignIn();
	}}>Sign-In</div>|
	<div id='signup' onClick={() => console.log('signup')}>Sign-Up</div>
	</div>
	</div>);
}

function BlogCanvas() {
	return (<div>
	<Heading/>
	<div id='blogcanvasWrapper'>
	<div id='blogcanvas'>
	This is a blog
	</div>
	</div>
	</div>);
}

function App() {

	const getResp = () => {
		fetch('/make_post', {method: 'POST'})
			.then(resp => { return resp.json() })
			.then(json => console.log(json));
	}

	return (<div id='app'>
	<PostSelector get={getResp}/>
	<BlogCanvas/>
	</div>);
}

function RenderApp() {
	ReactDOM.render(<App/>, document.getElementById('root'));
}

function RenderSignIn() {
	ReactDOM.render(<SignIn/>, document.getElementById('root'));
}

// render initial page
RenderApp();
