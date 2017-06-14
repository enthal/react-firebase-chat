import React from 'react';
import ReactDOM from 'react-dom';
// import App from './App';
import registerServiceWorker from './registerServiceWorker';
import * as firebase from 'firebase';
import { connect } from 'react-firebase'
import * as _ from 'lodash';
import './index.css';


// Initialize Firebase
const config = {
  apiKey: "AIzaSyAISM-8pOrWliQ8rpSS0SHC5kHwxk7NZ0w",
  authDomain: "chit-chat-42aa1.firebaseapp.com",
  databaseURL: "https://chit-chat-42aa1.firebaseio.com",
  projectId: "chit-chat-42aa1",
  storageBucket: "chit-chat-42aa1.appspot.com",
  messagingSenderId: "251175505954"
};
firebase.initializeApp(config);
const db = firebase.database();

const Prototype = (props) => {
  console.log('snapshot', props);
  const post = () => {
    const postRef = db.ref('posts').push({
      what: 'ever:'+Math.random(),
    });
    console.log(postRef);
  };
  return (
    <div>
      <h1>My Prototype</h1>
      <pre>{JSON.stringify(props,0,2)}</pre>
      <button onClick={post}>post</button>
      <Posts posts={props.posts} />
    </div>
  );
}

const Chat = () => {
  return (
    <div>
      <h1>Chat</h1>
      <LivePosts />
    </div>
  );
}

const LivePosts = connect({
    posts:'posts'
  })(
    ({posts}) => (
      <div>
        <h1>Theeeee Posts:</h1>
        <ul>
          {_.map(posts, (post, id) => <li key={id}><Post {...post} /></li>)}
        </ul>
      </div>
    )
  );

// const LiveRooms = (roomsRef) => NamedThings('Rooms!', roomsRef);
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

const Posts = ({posts}) => (
  <div>
    <h1>The Posts:</h1>
    <ul>
      {_.map(posts, (post, id) => <li key={id}><Post {...post} /></li>)}
    </ul>
  </div>
);

const Post = ({what}) => (
  <div>
    {what}
  </div>
);


db.ref().on('value', snapshot => {
  const store = snapshot.val();
  ReactDOM.render(
    <Prototype {...store} />,
    document.getElementById('root-prototype')
  );
});
ReactDOM.render(
  <Chat />,
  document.getElementById('root')
);



// ReactDOM.render(<App />, document.getElementById('root'));

registerServiceWorker();
