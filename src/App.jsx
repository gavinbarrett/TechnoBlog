import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import BlogCanvas from './BlogCanvas.jsx';
import { PostSelector } from './PostSelector.jsx';

function App() {

	const [posts, updatePosts] = useState(null);
	const [postMaker, updatePM] = useState(null);
	const [canvas, setCanvas] = useState(null);
	const [canvasState, updateCanvasState] = useState(null);
	const [jwToken, setJWToken] = useState(null);

	useEffect(() => {
		console.log('App loaded.');
		// get our posts from the database
		getPosts();
	}, []);

	const getPosts = () => {
		// pull all blog posts from the database
		fetch('/get_posts')
			.then(resp => {return resp.json()})
			.then(json => {
				// update the post selector with the blog posts
				updatePosts(json['posts']);
			});
	}

	const getResp = () => {
		fetch('/make_post', {method: 'POST'})
			.then(resp => { return resp.json() })
			.then(json => console.log(json));
	}

	return (<div id='app'>
	<PostSelector posts={posts} updatePM={updatePM} setCanvas={setCanvas} updateCanvasState={updateCanvasState}/>
	<BlogCanvas postMaker={postMaker} updatePM={updatePM} getPosts={getPosts} canvas={canvas} canvasState={canvasState} updateCanvasState={updateCanvasState} setJWToken={setJWToken}/>
	</div>);
}

function RenderApp() {
	ReactDOM.render(<App/>, document.getElementById('root'));
}

// render initial page
RenderApp();
