import React from 'react';
import Topic from './Topic.jsx';

const Topics = ({topics, userId, hitServer, display, updateTopicId, updateModalUserMessage, showModal}) => (
  <div>
    <h1>These are the Topics</h1>
    {topics.map((topic, index) => <Topic topic={topic}
                                         userId={userId}
                                         hitServer={hitServer}
                                         key={index}
                                         display={display}
                                         showModal={showModal}
                                         updateTopicId={updateTopicId}
                                         updateModalUserMessage={updateModalUserMessage}
                                  />)}
  </div>
);
export default Topics;
