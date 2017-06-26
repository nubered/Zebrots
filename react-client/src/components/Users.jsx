import React from 'react';
import User from './User.jsx';

const Users = ({users, addUser}) => (
  <div>
    <h4>Users Component</h4>
    <button onClick={addUser}>Add User</button>
    <div>There are { users.length } users.</div>
    { users.map((userObj, index) => <User user={userObj} key={index} /> )}
  </div>
);

export default Users;