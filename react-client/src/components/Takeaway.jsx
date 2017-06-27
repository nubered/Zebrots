import React from 'react';

const Takeaway = ({takeaway}) => (
  <div class="takeaway">
    <div><strong>Collaborators:       </strong> {takeaway.user_Q_id, takeaway.user_A_id}</div>
    <div><strong>Date:                </strong> {takeaway.user_A_id}</div>
    <div><strong>What we investigated:</strong> {takeaway.topic}</div>
    <div><strong>What we learned:     </strong> {takeaway.text}</div>
  </div>
);

export default Takeaway;