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

const RUN = () => ReactDOM.render(
  <Chat />,
  document.getElementById('root')
);

const viewState = {};
const selectRoom = roomId => {
  viewState.selectedRoomId = roomId;
  // viewState.liveRooms.forceUpdate();
  console.log(viewState);
}

const Chat = () => {
  viewState.liveRooms = <LiveRooms passthru="passed!"/>;
  return (
    <div>
      <h1>Chat</h1>
      <LiveUsers />
      {viewState.liveRooms}
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


const LiveRooms = connect(
  (props, ref) => ({
    rooms: 'rooms',
    pushRoom: (what) => ref('rooms').push({what}),
  }),
  (ownProps, firebaseProps) => {
    console.log('LiveRooms mergeProps:', ownProps, firebaseProps);
    return Object.assign({the:'thing'}, ownProps, firebaseProps);
  },
)(
  ({rooms, pushRoom, passthru}) =>
    NamedThings("Rooms", rooms, pushRoom, Room, passthru)
);

const Room = ({what}, id) => (
  <div
    className={classNames({selected: id === viewState.selectedRoomId})}
    onClick={()=> selectRoom(id)}
    >
    {what}
  </div>
);

/*
class Room extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: false,
    }
    this.onClick = this.onClick.bind(this);
  }
  onClick(e) {
    this.setState(state => { selected:!state.selected });
  }
  render() {
    <div
      className={classNames({'selected':this.state.selected})}
      onClick={this.onClick}>
    </div>
  }
}
// */


const NamedThings = (title, thingsById, make, renderThing, the) => (
  <div className='named-things'>
    <h1>{title}</h1>
    <ul>
    {_.map(thingsById, (thing, id) => (
      <li key={id}>
        {renderThing(thing, id)}
      </li>
    ))}
    </ul>
    <InputAndButton
      buttonTitle="Make"
      onSubmit={what => make(what)}
      />
    {the}
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

RUN();

// ReactDOM.render(<App />, document.getElementById('root'));

registerServiceWorker();
