import React from 'react';
const Timestamp = require('react-timestamp');

class Topic extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      topic: props.topic,
      message: props.topic.topic,
      classname: 'topic',
      userId: props.userId
    };
  }

  toggle() {
    this.setState({
      message: this.state.classname === 'topic' ? 'Connect' : this.state.topic.topic,
      classname: this.state.classname === 'topic' ? 'connect' : 'topic'
    })
  }

  connect() {
    if(this.state.userId === this.state.topic.user_q_id) {
      alert("Can't connect with your own topic :-(");
      return;
    }

    this.props.updateTopicId(this.state.topic.id);

    this.props.hitServer('/connectTopic', {topicId: this.state.topic.id, user_q_id: this.state.topic.user_q_id}, 'POST')
      .then(() => {
        this.props.updateModalUserMessage("Find me, and let's connect!");
        this.props.display('/user', {userId: this.state.topic.user_q_id})
          .then(() => {
            this.props.showModal('user');
          });
      })
      .catch(err => {
        debugger;
      });
  }

  render() {
    return (
      <div
        className={this.state.classname}
        onMouseOver={this.toggle.bind(this)}
        onMouseOut={this.toggle.bind(this)}
        onClick={this.connect.bind(this)}
      >
        <div>{this.state.message}</div>
        <div><Timestamp time={this.state.topic.timestamp} /></div>
      </div>
    )
  }
}

export default Topic;
