# React+Firebase Chat WebApp

Chat!  Auth, users, rooms, messages, all live updating.

## Story time

- Info arch:
  - User:
    - Rooms
  - Room:
    - name
    - Members (Users)
    - Messages
  - Message:
    - From (User)
    - timestamp
    - content (text)
- Auth:
  - make/connect an account
  - login as user
  - a user can only view messages or post in rooms of which user is member
  - logout
- User:
  - Lists all Rooms of which User is Member
    - Auto-update on new Room
  - creates Room (unique name, no members)
- Member of room:
  - Adds nonmember User to Room
  - Posts a Message
  - Select some Room as Current
  - Reads Messages in current Room
    - Newest to oldest (up or down, just pick one)
    - Infinite-scroll (or load more button)
    - Auto-update on new Message
  - Lists all members of Room, with Presence
- Presence
  - User sees when (dis)connected
  - User sees (dis)connectedness for any other visible user name

## Working

- Hello World (per [this](http://blog.tylerbuchea.com/create-react-app-firebase-for-prototyping/))

## TODO

- Auth: create, login
- DB rules for viewing rooms by membership
-

# Of note

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).
