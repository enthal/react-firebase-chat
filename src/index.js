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
          selectedId={this.state.selectedUserId}
          select={this.selectUser}
          />
        {this.state.selectedUserId &&
          <LiveRooms
            selectedId={this.state.selectedRoomId}
            select={this.selectRoom}
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
    things: 'users',
    push: (what) => ref('users').push({what}),
  })
)(
  (propsAndData) =>
    NamedThings("Users", Post, propsAndData)
);


const LiveRooms = connect(
  (props, ref) => ({
    things: 'rooms',
    push: (what) => ref('rooms').push({what}),
  }),
)(
  (propsAndData) =>
    NamedThings("Rooms", Room, propsAndData)
);

const Room = ({what}) => (
  <div>
    {what}
  </div>
);

const LiveMessages = connect(
  ({selectedUserId, selectedRoomId}, ref) => ({
    things: 'messages/'+selectedRoomId,
    push: (text) => {
      if (!selectedUserId || !selectedRoomId)  return;
      return ref('messages/'+selectedRoomId).push({
        userId: selectedUserId,
        when: firebase.database.ServerValue.TIMESTAMP,
        text,
      });
    },
    users: 'users',
    room: 'rooms/'+selectedRoomId,
  })
)(
  (propsAndData) =>
    NamedThings("Messages", Message, propsAndData)
);

const Message = ({userId, when, text}, id, auxPropsAndData) => (
  <ul className='message'>
    <li className='from'>{(auxPropsAndData.users[userId]||[]).what}</li>
    <li className='when'>{when && (new Date(when)).toString()}</li>
    <li className='text'>{text}</li>
  </ul>
);


const NamedThings = (title, renderThing, propsAndData) => {
  const {things, push, selectedId, select, ...auxPropsAndData} = propsAndData;
  if (select && !selectedId && _.size(things))  select(_.first(_.keys(things)));  // TODO: no: "Warning: setState(...): Cannot update during an existing state transition (such as within `render` or another component's constructor). Render methods should be a pure function of props and state; constructor side-effects are an anti-pattern, but can be moved to `componentWillMount`."
  return (
    <div className={classNames('named-things', {'selectable-list':select})}>
      <h1>{title}</h1>
      <ul>
      {_.map(things, (thing, id) => (
        <li
          key={id}
          className={classNames({selected: id === selectedId})}
          onClick={()=>select&&select(id)}
          >
          {renderThing(thing, id, auxPropsAndData)}
        </li>
      ))}
      </ul>
      <InputAndButton
        buttonTitle="Make"
        onSubmit={what => push(what).catch(e => alert(e))}  // TODO: non-modal error reporting please
        />
    </div>
  )
};


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
