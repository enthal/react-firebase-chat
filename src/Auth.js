import React, { Component } from 'react';
import './Auth.css';
import FirebaseUIAuth from './FirebaseUIAuth';
// import firebase, { ui } from './firebase'
import firebase from './firebase';
import * as firebaseui from 'firebaseui';
import * as _ from 'lodash';

const ui = new firebaseui.auth.AuthUI(firebase.auth());

class Auth extends Component {
  state = {
    loading: true,
    user: null
  }

  constructor() {
    super();
    this.uiConfig = {
      callbacks: {
        signInSuccess: (currentUser, credential, redirectUrl) => {
          return false;  // Do not redirect.
        }
      },


      signInFlow: 'popup',  // Opens IDP Providers sign-in flow in a popup.
      signInOptions: [
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
        // {
        //   provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        //   scopes: ['https://www.googleapis.com/auth/plus.login']
        // },
        // {
        //   provider: firebase.auth.FacebookAuthProvider.PROVIDER_ID,
        //   scopes: [
        //     'public_profile',
        //     'email',
        //     'user_likes',
        //     'user_friends'
        //   ]
        // },
        // firebase.auth.TwitterAuthProvider.PROVIDER_ID,
        // firebase.auth.GithubAuthProvider.PROVIDER_ID,
      ],

      tosUrl: 'https://www.google.com', // Terms of service url.
    };
  }

  componentDidMount() {
    this.unlistenAuth = firebase.auth().onAuthStateChanged((user) => {
      let userRecord;
      if (user) {
        userRecord = _.pick(user, ['displayName','email','photoURL']);
        const db = firebase.database();
        db.ref("/lastSignin").set(firebase.database.ServerValue.TIMESTAMP);
        db.ref('users/'+user.uid).set(userRecord);
      }
      console.log('** onAuthStateChanged:', userRecord);
      this.setState({loading: false, user: userRecord});
    });
  }
  componentWillUnmount() {
    this.unlistenAuth && this.unlistenAuth();
  }

  render() {
    console.log('** user', this.state.user);
    return (
      <div className="Auth">
        {this.state.loading ? (
          <div className="loading">Loading...</div>
        ) : (
          this.state.user ? (
            <div>
              <div className="user-info">
                {this.state.user.photoURL && (
                  <div className="photo-container">
                    <img className="photo" src={this.state.user.photoURL} alt={this.state.user.displayName} />
                  </div>
                )}
                <div>{this.state.user.displayName}</div>
                <div>{this.state.user.email}</div>
                <button onClick={() => {firebase.auth().signOut()}}>Sign Out</button>
              </div>
              <div>
              </div>
            </div>
          ) : (
            <div>
              <FirebaseUIAuth ui={ui} {...this.uiConfig} />
            </div>
          )
        )}
      </div>
    );
  }
}

export default Auth;
