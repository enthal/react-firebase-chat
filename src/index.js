import React from 'react';
import ReactDOM from 'react-dom';
// import App from './App';
import Auth from './Auth';

import registerServiceWorker from './registerServiceWorker';
import firebase from './firebase';
import { connect } from 'react-firebase';
import classNames from 'classnames';
import * as _ from 'lodash';
import './index.css';


class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRoomId: null,
      user: null,
    };
  }

  selectRoom = (id) => {
    this.setState({selectedRoomId: id});
    console.log("selectRoom", this);
  }
  componentDidMount() {
    this.unlistenAuth = firebase.auth().onAuthStateChanged((user) => {
      // user: same as firebase.auth().currentUser
      this.setState({user});
    });
  }
  componentWillUnmount() {
    this.unlistenAuth && this.unlistenAuth();
  }

  render() {
    return (
      <div>
        <h1>Chat</h1>
        <Auth />
        {this.state.user &&
          <div>
          <LiveUsers />
          <LiveRooms
            selectedId={this.state.selectedRoomId}
            select={this.selectRoom}
            />
          {this.state.selectedRoomId &&
            <LiveMessages
              userId={this.state.user.uid}
              selectedRoomId={this.state.selectedRoomId}
              />
          }
          </div>
        }
      </div>
    );
  }
}

const LiveUsers = connect((props, ref) => ({
    things: 'users',
  })
)(
  (propsAndData) =>
    NamedThings("Users", UserDetail, propsAndData)
);

const UserDetail = ({displayName, email, photoURL}) => (
  <ul className='user-detail'>
    <li className='display-name'>{displayName}</li>
    <li className='email'>{email}</li>
  </ul>
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
  ({userId, selectedRoomId}, ref) => ({  // TODO {auth}
    things: 'messages/'+selectedRoomId,
    push: (text) => {
      if (!userId || !selectedRoomId)  return;
      return ref('messages/'+selectedRoomId).push({
        userId,
        when: firebase.database.ServerValue.TIMESTAMP,
        text,
      });
    },
    users: 'users',  // TODO: with scale, getting all users will be bad
    room: 'rooms/'+selectedRoomId,
  })
)(
  (propsAndData) =>
    NamedThings("Messages", Message, propsAndData)
);

const Message = ({userId, when, text}, id, {users}) => (
  <ul className='message'>
    <li className='from'>{(users&&users[userId]||[]).displayName}</li>
    <li className='when'>{when && (new Date(when)).toString()}</li>
    <li className='text'>{text}</li>
  </ul>
  // TODO: from.onClick: show details on that user and any private/direct chat
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
      {push &&
        <InputAndButton
          buttonTitle="Make"
          onSubmit={what => push(what).catch(e => alert(e))}  // TODO: non-modal error reporting please
        />
      }
    </div>
  )
};


class InputAndButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
    }
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

  onChange = (e) => {
    this.setState({text: e.target.value.trimLeft()});
  }

  onSubmit = (e) => {
    console.log("onSubmit:",e);
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
