import React from 'react';
import ReactDOM from 'react-dom';
// import App from './App';
import registerServiceWorker from './registerServiceWorker';
import * as firebase from 'firebase';
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
  const post = () => db.ref('post').set({
    what: 'ever:'+Math.random(),
  });
  return (
    <div>
      <h1>My Prototype</h1>
      <pre>{JSON.stringify(props,0,2)}</pre>
      <button onClick={post}>post</button>
      <Post {...props.post} />
    </div>
  );
}

const Post = ({what}) => (
  <div>
    <h1>A post</h1>
    {what}
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
