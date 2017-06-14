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
      <LiveRooms />
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

const Rooms = (props) => {
  return (
    <div>
      <h1>The Rooms:</h1>
      <ul>
        {_.map(props.rooms, (post, id) =>
          <li key={id}>
            <Post {...post} />
          </li>
        )}
      </ul>
      <InputAndButton
        buttonTitle="Make Room"
        onSubmit={what => props.pushRoom(what)}
        />
    </div>
  )
};
const LiveRooms = connect((props, ref) => ({
    rooms: 'rooms',
    pushRoom: (what) => ref('rooms').push({what}),
  })
) (Rooms);


class InputAndButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
    }
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  render() {
    return (
      <div>
        <form onSubmit={this.onSubmit}>
          <input onChange={this.onChange} value={this.state.text} />
          <button disabled={!this.state.text.trim()}>{this.props.buttonTitle}</button>
        </form>
      </div>
    );
  }

  onChange(e) {
    this.setState({text: e.target.value.trimLeft()});
  }

  onSubmit(e) {
    console.log("onSubmit",e);
    e.preventDefault();
    this.props.onSubmit(this.state.text.trim());
    this.setState({text: ""});
  }
}


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
