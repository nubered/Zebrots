import React from 'react';

const Takeaway = ({takeaway}) => (
  <div className="takeaway" >
    <div><strong>Collaborators:</strong>        {takeaway.usernameQ + ', ' + takeaway.usernameA}</div>
    <div><strong>Date:</strong>                 {takeaway.date}</div>
    <div><strong>What we investigated:</strong> {takeaway.topic}</div>
    <div><strong>What we learned:</strong>      {takeaway.takeaway}</div>
  </div>
);

export default Takeaway;
