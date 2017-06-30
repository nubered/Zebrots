import React from 'react';
const Timestamp = require('react-timestamp');

const Topic = ({topic, timestamp}) => (
  <div className="topic">
    <div>{topic.topic}</div>
    <div><Timestamp time={timestamp} /></div>
  </div>
);
export default Topic;
