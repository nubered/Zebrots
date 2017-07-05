import React from 'react';

const User = ({user}) => (
  <div className="user">
    <div><strong>Name:</strong>  {user.handle}</div>
    <div><strong>Email:</strong>  {user.email}</div>
    <div><img src={user.avatar_url} /></div>
  </div>
);
export default User;
