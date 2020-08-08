import React from 'react';
import ReactDOM from 'react-dom';
import { PostMaker } from './PostSelector.jsx';
import { SignIn, SignUp } from './Logins.jsx';

function Logins({renderSignIn, renderSignUp}) {
	return (<div id='heading'>
	<div id='head'>TechBlock</div>
	<div id='loginbuttons'>
	<div id='signin' onClick={() => {
		// render the sign in page
		renderSignIn("Please sign in.");
	}}>Sign-In</div>|
	<div id='signup' onClick={() => {
		// render the sign up page; FIXME: these two components should be consolidated
		renderSignUp();
	}}>Sign-Up</div>
	</div>
	</div>);
}

function BlogCanvas({postMaker, updatePM, getPosts, canvas, canvasState, updateCanvasState, setJWToken}) {
	const RenderSignIn = (displayMessage) => {
		ReactDOM.render(<SignIn displayMessage={displayMessage} setJWToken={setJWToken}/>, document.getElementById('root'));
	}
	const RenderSignUp = () => {
		ReactDOM.render(<SignUp/>, document.getElementById('root'));
	}
	let canvasComponent = '';
	if (canvasState === 'addpost')
		canvasComponent = <PostMaker updatePM={updatePM} getPosts={getPosts} updateCanvasState={updateCanvasState}/>;
	else if (canvasState === 'canvas')
		canvasComponent = canvas;
	return (<div>
	<Logins renderSignIn={RenderSignIn} renderSignUp={RenderSignUp}/>
	<div id='blogcanvasWrapper'>
	<div id='blogcanvas'>
	{canvasComponent}
	</div>
	</div>
	</div>);
}

export default BlogCanvas;
