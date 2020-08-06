import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { SignIn, SignUp } from './Logins.jsx';

function PostArray({posts}) {
	return (<div>This is a post array {posts}</div>);
}

function PostMaker({updatePM}) {
	
	const addPostToDB = () => {
		const title = document.getElementById('posttitle');
		const postbody = document.getElementById('postbody');
		const tags = document.getElementById('posttags');
		//FIXME: check for null/malicious values

		// send the input post data to the server
		fetch('/add_post', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({"title": title.value, "postbody": postbody.value, "tags": tags.value})})
			.then(resp => {return resp.json()})
			.then(json => console.log(json));
		// remove the post maker component
		updatePM(false);
	}

	return (<div id='postmaker'>
		<div className="close" onClick={() => updatePM(false)}>&times;</div>
		<input id='posttitle' placeholder='Enter your post title here.'/>
		<input id='postbody' placeholder='Enter your post here.'/>
		<input id='posttags' placeholder='Enter any post tags here.'/>
		<button id='submitpost' onClick={() => addPostToDB()}>Submit Post</button>
	</div>);
}

function PostSelector({get, posts, updatePM}) {

	useEffect(() => {
		// FIXME: re-render when posts is updated
		console.log('Posts were updated.');
	}, [posts]);

	return (<div>
	<div id='postselectorWrapper' onClick={() => get()}>
	<div id='postselector'>
	{posts ? <PostArray posts={posts}/> : "There are no blog posts."}
	</div>
	</div>
	<div id='addpostWrapper'>
	<button id='addpost' onClick={() => updatePM(true)}>
	Add a post
	</button>
	</div>
	</div>);
}

function Heading() {
	return (<div id='heading'>
	<div id='head'>TechBlock</div>
	<div id='loginbuttons'>
	<div id='signin' onClick={() => {
		// render the sign in page
		RenderSignIn();
	}}>Sign-In</div>|
	<div id='signup' onClick={() => {
		// render the sign up page; FIXME: these two components should be consolidated
		RenderSignUp();
	}}>Sign-Up</div>
	</div>
	</div>);
}

function BlogCanvas({postMaker, updatePM}) {
	return (<div>
	<Heading/>
	<div id='blogcanvasWrapper'>
	<div id='blogcanvas'>
	{postMaker ? <PostMaker updatePM={updatePM}/> : 'Choose a post to display it here.'}
	</div>
	</div>
	</div>);
}

function App() {

	const [posts, updatePosts] = useState(null);
	const [postMaker, updatePM] = useState(null);

	useEffect(() => {
		console.log('App loaded.');
		// get our posts from the database
		fetch('/get_posts')
			.then(resp => {return resp.json()})
			.then(json => loadPostCards(json));
	}, []);

	const loadPostCards = (posts) => {
		// FIXME: load each post into the post
		//updatePosts(posts);
		console.log(posts);
	}

	const getResp = () => {
		fetch('/make_post', {method: 'POST'})
			.then(resp => { return resp.json() })
			.then(json => console.log(json));
	}

	return (<div id='app'>
	<PostSelector posts={posts} updatePM={updatePM}/>
	<BlogCanvas postMaker={postMaker} updatePM={updatePM}/>
	</div>);
}

function RenderApp() {
	ReactDOM.render(<App/>, document.getElementById('root'));
}

function RenderSignIn() {
	ReactDOM.render(<SignIn/>, document.getElementById('root'));
}

function RenderSignUp() {
	ReactDOM.render(<SignUp/>, document.getElementById('root'));
}

// render initial page
RenderApp();
