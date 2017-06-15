import React from 'react';
import ReactDOM from 'react-dom';
// import App from './App';
import registerServiceWorker from './registerServiceWorker';
import * as firebase from 'firebase';
import { connect } from 'react-firebase';
import classNames from 'classnames';
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

class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRoomId: null,
    };
    this.selectRoom = this.selectRoom.bind(this);
    this.selectUser = this.selectUser.bind(this);
  }

  selectRoom(id) {
    this.setState({selectedRoomId: id});
  }
  selectUser(id) {
    this.setState({selectedUserId: id});
  }

  render() {
    return (
      <div>
        <h1>Chat</h1>
        <LiveUsers
          selectedUserId={this.state.selectedUserId}
          selectUser={this.selectUser}
          />
        {this.state.selectedUserId &&
          <LiveRooms
            selectedRoomId={this.state.selectedRoomId}
            selectRoom={this.selectRoom}
            />
        }
        {this.state.selectedRoomId &&
          <LiveMessages
            selectedUserId={this.state.selectedUserId}
            selectedRoomId={this.state.selectedRoomId}
            />
        }
      </div>
    );
  }
}

const LiveUsers = connect((props, ref) => ({
    users: 'users',
    pushUser: (what) => ref('users').push({what}),
  })
)(
  ({users, pushUser, selectedUserId, selectUser}) =>
    NamedThings("Users", users, pushUser, Post, selectedUserId, selectUser)
);


const LiveRooms = connect(
  (props, ref) => ({
    rooms: 'rooms',
    pushRoom: (what) => ref('rooms').push({what}),
  }),
)(
  ({rooms, pushRoom, selectedRoomId, selectRoom}) =>
    NamedThings("Rooms", rooms, pushRoom, Room, selectedRoomId, selectRoom)
);

const Room = ({what}) => (
  <div>
    {what}
  </div>
);

const LiveMessages = connect(
  ({selectedUserId, selectedRoomId}, ref) => ({
    things: {
      path: 'messages',
      orderByChild: 'roomId',
      equalTo: selectedRoomId,
    },
    push: (text) => {
      if (!selectedUserId || !selectedRoomId)  return;
      ref('messages').push({
        userId: selectedUserId,
        roomId: selectedRoomId,
        when: firebase.database.ServerValue.TIMESTAMP,
        text,
      });
    },
  })
)(
  ({things, push, selectedRoomId, selectedUserId}) =>
    NamedThings("Messages", things, push, Message)
);

const Message = ({userId, when, text}) => (
  <ul>
    <li>{userId}</li>
    <li>{when && (new Date(when)).toString()}</li>
    <li>{text}</li>
  </ul>
);


const NamedThings = (title, thingsById, make, renderThing, selectedId, select) => (
  <div className={classNames('named-things', {'selectable-list':select})}>
    <h1>{title}</h1>
    <ul>
    {_.map(thingsById, (thing, id) => (
      <li
        key={id}
        className={classNames({selected: id === selectedId})}
        onClick={()=>select&&select(id)}
        >
        {renderThing(thing, id)}
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
registerServiceWorker();
