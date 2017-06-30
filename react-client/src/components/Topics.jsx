import React from 'react';
import Topic from './Topic.jsx';

const Topics = ({topics}) => (
  <div>
    <h1>These are the Topics</h1>
    {topics.map((topic, index) => <Topic topic={topic} key={index} />)}
  </div>
);
export default Topics;
