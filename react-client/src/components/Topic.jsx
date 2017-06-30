import React from 'react';
const Timestamp = require('react-timestamp');

const Topic = ({topic}) => (
  <div className="topic">
    <div>{topic.topic}</div>
    <div><Timestamp time={topic.timestamp} /></div>
  </div>
);
export default Topic;
