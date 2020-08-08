import React, { useEffect } from 'react';

function Canvas({title, body, tags, timestamp}) {
	return(<div id='canvas'>
	<div id='canvastitle'>{title}</div>
	<div id='canvastags'>{tags}</div>
	<div id='canvasdatetime'>{timestamp}</div>
	<div id='canvasbody'>{body}</div>
	</div>);
}

function PostEntry({title, body, tags, time, setCanvas, updateCanvasState}) {
	const displayPost = () => {
		updateCanvasState('canvas');
		// take data and add it to a canvas component that lives in the blogcanvas
		setCanvas(<Canvas title={title} body={body} tags={tags} time={time}/>);
		//FIXME: add all data to a state var
		//FIXME: set canvas boolean
	}
	return (<div className='postentry' onClick={() => displayPost()}>
	<p>{title}</p>
	<p>{tags}</p>
	</div>);
}

function PostArray({posts, setCanvas, updateCanvasState}) {
	let j = 0;
	let postarray = [];
	for (let i = 0; i < posts.length; i++) {
		postarray.push(<PostEntry key={j} title={posts[i]['title']} body={posts[i]['post']} tags={posts[i]['tags']} time={posts[i]['datetime']} setCanvas={setCanvas} updateCanvasState={updateCanvasState}/>);
		j++;
	}
	return (<div id='postarray'>{postarray}</div>);
}

function PostMaker({updatePM, getPosts, updateCanvasState}) {
	
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
		// update the PostSelector with the new posts
		getPosts();
	}

	return (<div id='postmaker'>
		<div className="close" onClick={() => {
			updateCanvasState(null);
			updatePM(false);
		}}>&times;</div>
		<input id='posttitle' placeholder='Enter your post title here.'/>
		<textarea id='postbody' placeholder='Enter your post here.'/>
		<input id='posttags' placeholder='Enter any post tags here.'/>
		<button id='submitpost' onClick={() => addPostToDB()}>Submit Post</button>
	</div>);
}

function PostSelector({get, posts, updatePM, setCanvas, updateCanvasState}) {

	useEffect(() => {
		// FIXME: re-render when posts is updated
		console.log('Posts were updated.');
	}, [posts]);

	return (<div>
	<div id='postselectorWrapper'>
	<div id='postselector'>
	{posts ? <PostArray posts={posts} setCanvas={setCanvas} updateCanvasState={updateCanvasState}/> : "There are no blog posts."}
	</div>
	</div>
	<div id='addpostWrapper'>
	<button id='addpost' onClick={() => {
		updateCanvasState('addpost');
		updatePM(true)
	}}>
	Add a post
	</button>
	</div>
	</div>);
}

export {
	PostMaker,
	PostSelector
}
