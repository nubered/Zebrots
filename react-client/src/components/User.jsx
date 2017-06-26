import React from 'react';

const User = ({user}) => (
  <div className="user">
    <div><strong>Name:</strong>  {user.name}</div>
    <div><strong>Email:</strong>  {user.email}</div>
    <div><strong>GitHub Id:</strong>  {user.gitHub}</div>
  </div>
);
export default User;