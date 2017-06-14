import React from 'react';
import ReactDOM from 'react-dom';
// import App from './App';
import registerServiceWorker from './registerServiceWorker';
import * as firebase from 'firebase';
import { connect } from 'react-firebase'
import * as _ from 'lodash';
import './index.css';


firebase.initializeApp({
  apiKey: "AIzaSyAISM-8pOrWliQ8rpSS0SHC5kHwxk7NZ0w",
  authDomain: "chit-chat-42aa1.firebaseapp.com",
  databaseURL: "https://chit-chat-42aa1.firebaseio.com",
  projectId: "chit-chat-42aa1",
  storageBucket: "chit-chat-42aa1.appspot.com",
  messagingSenderId: "251175505954"
});


const Chat = () => {
  return (
    <div>
      <h1>Chat</h1>
      <LivePosts />
    </div>
  );
}

const Posts = (props) => (
  <div>
    <h1>The Posts:</h1>
    <ul>
      {_.map(props.posts, (post, id) =>
        <li key={id}>
          <Post {...post} />
        </li>
      )}
    </ul>
    <button onClick={props.pushPost}>post</button>
  </div>
);
const LivePosts = connect((props, ref) => ({
    posts: 'posts',
    pushPost: () => ref('posts').push({
        what: 'Ever: '+Math.random(),
      }),
  })
) (Posts);

// const LiveRooms = (roomsRef) => NamedThings('Rooms!', roomsRef);
/*
const NamedThings = (title, thingsById) => {
  return (
    <div>
      <h1>{title}</h1>
      <li>
      {_.map(thingsById, (thing, id) => (
        <li key={id}>
          {thing.name}
        </li>
      ))}
      </li>
    </div>
  );
}
*/

const Post = ({what}) => (
  <div>
    {what}
  </div>
);


ReactDOM.render(
  <Chat />,
  document.getElementById('root')
);



// ReactDOM.render(<App />, document.getElementById('root'));

registerServiceWorker();
