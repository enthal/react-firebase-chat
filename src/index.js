import React from 'react';
import ReactDOM from 'react-dom';
// import App from './App';
import registerServiceWorker from './registerServiceWorker';
import * as firebase from 'firebase';
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

const App = (props) => {
  console.log('snapshot', props);
  const post = () => {
    const aPost = {
      what: 'ever:'+Math.random(),
    }
    db.ref('post').set(aPost);
    const postRef = db.ref('posts').push(aPost);
    console.log(postRef);
  };
  return (
    <div>
      <h1>My Prototype</h1>
      <pre>{JSON.stringify(props,0,2)}</pre>
      <button onClick={post}>post</button>
      <Post {...props.post} />
      <Posts posts={props.posts} />
    </div>
  );
}

const Post = ({what}) => (
  <div>
    <h1>A post</h1>
    {what}
  </div>
);

const Posts = ({posts}) => (
  <div>
    <h1>The Posts:</h1>
    <ul>
      {_.map(posts, (post) => <li><Post {...post} /></li>)}
    </ul>
  </div>
);


db.ref().on('value', snapshot => {
  const store = snapshot.val();
  ReactDOM.render(
    <App {...store} />,
    document.getElementById('root')
  );
});

ReactDOM.render(
  <App />,
  document.getElementById('root')
);


// ReactDOM.render(<App />, document.getElementById('root'));

registerServiceWorker();
