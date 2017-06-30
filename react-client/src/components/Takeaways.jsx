import React from 'react';
import Takeaway from './Takeaway.jsx';

const Takeaways = ({takeaways, createTakeaway}) => (
  <div className="takeaways">
    <h4>Takeaways Component</h4>
    <button id="createTakeawayButton" onClick={createTakeaway}>Create Takeaway</button>
    <div>There are { takeaways.length } takeaways.</div>
    { takeaways.map((takeawayObj, index) => 
      <Takeaway takeaway={takeawayObj} key={index} /> )}
  </div>
);

export default Takeaways;