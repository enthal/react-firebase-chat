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
      <LiveUsers />
      <LiveRooms />
    </div>
  );
}


const LiveUsers = connect((props, ref) => ({
    users: 'users',
    pushUser: (what) => ref('users').push({what}),
  })
)(
  ({users, pushUser}) =>
    NamedThings("Users", users, pushUser, Post)
);


const LiveRooms = connect((props, ref) => ({
    rooms: 'rooms',
    pushRoom: (what) => ref('rooms').push({what}),
  })
)(
  ({rooms, pushRoom}) =>
    NamedThings("Rooms", rooms, pushRoom, Post)
);


const NamedThings = (title, thingsById, make, renderThing) => (
  <div className='.named-things'>
    <h1>{title}</h1>
    <ul>
    {_.map(thingsById, (thing, id) => (
      <li key={id}>
        {renderThing(thing)}
      </li>
    ))}
    </ul>
    <InputAndButton
      buttonTitle="Make"
      onSubmit={what => make(what)}
      />
  </div>
);


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
