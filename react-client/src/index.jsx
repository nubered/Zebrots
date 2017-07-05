import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import io from 'socket.io-client';
import User from './components/User.jsx';
import Welcome from './components/Welcome.jsx';
import Takeaways from './components/Takeaways.jsx';
import ModalView from './components/ModalView.jsx';
import Topics from './components/Topics.jsx';
import helper from './helpers/utility.js';
import {ModalContainer, ModalDialog} from 'react-modal-dialog';



/*
var takeaways = [
  {id : 1, usernameQ : 'Kurt',   usernameA : 'Kamie',  date : '06/21/17', topic : 'Why are frameworks so burdensome', takeaway : 'Adulting is hard.'},
  {id : 2, usernameQ : 'Kamie',  usernameA : 'Azmeer', date : '06/23/17', topic : 'Promisifying',                     takeaway : 'Don\'t just *do* something, *SIT* there!'},
  {id : 3, usernameQ : 'Reuben', usernameA : 'David',  date : '06/25/17', topic : 'Is Angular God?',                  takeaway : 'Apparently \'i\' is just an *imaginary* number.'},
  {id : 4, usernameQ : 'Ben',    usernameA : 'Daniel', date : '06/28/17', topic : 'Breaking Promises',                takeaway : 'Now we know *why* there is a no-open-drink-container rule.'},
  {id : 5, usernameQ : 'Saikal', usernameA : 'Saloni', date : '06/29/17', topic : 'Where are my car keys?',           takeaway : 'Who knew semi-colons and colons were different things??'},
  ];
*/

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      user: {},
      topics: [],
      session: {},
      showModal: false,
      inviteSubmitted: false,
      takeaways: [],
      displayMode: 'topics',
      modalUserMessage: '',
      modalDisplay: {},
      currentModal: '',
      topicId: 0
    };
  }

  hitServer(url, data, method = 'GET', dataType = 'json') {
    return $.ajax({
      url: url,
      method: method,
      contentType: method === 'POST' ? 'application/json' : 'application/x-www-form-urlencoded; charset=UTF-8',
      data: method === 'POST' ? JSON.stringify(data) : data,
      dataType: method === 'POST' ? 'html' : dataType
    })
  }

  gitHubSignIn() {
    let clientId = '0e43b859aea47726fa84';
    let scopes = 'user';
    window.open(`https://github.com/login/oauth/authorize?client_id=${clientId}&scope=${scopes}`, '_self');
  }

  getUserSession() { // get a user if they have a session
    this.hitServer('/session')
      .then(userObj => {
        if(userObj.user.length) {
          this.setState({
            session: userObj.user[0]
          });
        }
      })
      .catch(err => {
        debugger;
        console.error('we have an error ', err);
      });
  }

  displayTakeaways() {
    this.hitServer('/takeaways')
    .then(takeaways => { // expect takeaways to be an array of takeaway objects
      console.log('TAKEAWAYS RETURNED FROM SERVER = ', takeaways);
      this.setState({ // INVOKING setState HERE AUTO-FORCES AN INVOCATION OF THE 'render' METHOD
        takeaways : takeaways,
        displayMode : 'takeaways'
      });
    })
    .catch(err => {
      console.error('ERROR RETRIEVING TAKEAWAYS: ', err);
    });
  }

  updateModalUserMessage(message) {
    this.setState({
      modalUserMessage: message
    });
  }

  displayTopics() {
    this.setState({
      displayMode: 'topics'
    })
  }

  setUpSockets() {
    // set up sockets
    const socket = io();
    socket.connect('http://localhost:3000');

    socket.on('connect_error', function(err) {
      console.log('error connecting to server');
    });

    socket.on('topicConnected', ({user_q_id, user_a_id}) => { // when a new topic has been picked up

      this.setState({topics: []}, () => {
        this.display('/topics');
      });

      if(this.state.session.id === user_q_id) { // if the userId returned is this client, request collaborator info
        this.updateModalUserMessage('On my way!');
        this.display('/user', {userId: user_a_id}).
        then(() => {
          this.showModal('user');
        });
      }
    });

    socket.on('topicCreated', () => { // when a new topic has been picked up
      this.display('/topics');
    });
  }

  componentDidMount() { // A lifecycle event that each component has (after render)
    // Render has already occurred; get users from database.
    this.getUserSession();
    this.setUpSockets();
    this.display('/topics');
  }


  showModal(name) {
   this.setState({currentModal: name});

    let display;
    switch (name) {
      case 'postTopic':
        display = <div>
                <h1>Ask a question and connect!</h1>
                <form>
                <input
                  id="inputTopic" type="text" size="60"
                  placeholder=" I haven't quite grokked React... Anyone down for a chat?"
                />
                <button onClick={this.post.bind(this, '/topics', null)}>Connect</button>
                </form>
              </div>;
        break;

      case 'topicPosted':
        display = <div>
                <h1>Thanks for connecting :-)</h1>
                <h3>Your topic has been posted</h3>
              </div>;
        break;

      case 'takeawayPosted':
        display = <div>
                <h1>Thanks for contributing your takeaway!</h1>
                <h3>Together, the community is strong :-)</h3>
              </div>;
        break;

      case 'user':
        display = <div>
          <h3>{this.state.modalUserMessage}</h3>
          <User user={this.state.user[0]} />;
        </div>;
        break;

      case 'postTakeaway':
        display = <div>
                <h1>Share what you learned...</h1>
                <form>
                <input
                  id="inputTakeaway" type="text" size="60"
                  placeholder=" What was the big takeaway?"
                />
                <button onClick={this.post.bind(this, '/takeaways', this.state.topicId)}>Connect</button>
                </form>
              </div>;
        break;
    }

    this.setState({
      modalDisplay: display,
      showModal: true});
  }

  closeModal() {

    debugger;
    this.setState({
      showModal: false,
      user: {}
    });

    if(this.state.currentModal === 'user') {
      this.showModal('postTakeaway')
    }
  }

  post(path, topicId, event) {
    debugger;
    event.preventDefault();
    let data = event.currentTarget.form.firstChild.value;
    if(!data.length) {
      alert("Did you forget something?_O");
      return;
    }

    if(path === '/takeaways') {
      data = {
        takeawayText: data,
        topicId: topicId
      }
    }

    // figure out sanitation
    this.hitServer(path, {data}, 'POST')
      .then(() => {
        if(path === '/topics') {
          this.showModal('topicPosted');
        } else if(path === '/takeaways') {
          this.showModal('takeawayPosted');
        }
      })
      .catch(err => {
        console.log('Error posting a topic ', err);
      });
  }

  display(path, data) {
    return new Promise((resolve, reject) => {
      this.hitServer(path, data)
      .then(stateObj => { // expect stateObj to be {property: value}
        this.setState(stateObj, () => {
          resolve() });
      })
      .catch(err => {
        console.error('error displaying state: ', err);
        reject(err);
      });
    });
  }

  updateTopicId(topicId) {
    this.setState({topicId: topicId});
  }
  render () {
    return (<div>
      <button onClick={this.showModal.bind(this, 'postTopic')}>Post</button>
      <button onClick={this.displayTopics.bind(this)}> Display Topics</button>
      <button onClick={this.displayTakeaways.bind(this)}> Display Takeaways </button>
      <h1>Gravitas</h1>

      <ModalView
        show={this.state.showModal}
        closeMethod={this.closeModal.bind(this)}
        display={this.state.modalDisplay}
      />

      {!helper.isEmpty(this.state.session) &&
      <Welcome session={this.state.session} /> }

      {helper.isEmpty(this.state.session) &&
      <button onClick={this.gitHubSignIn.bind(this)}> Sign in with GitHub</button>}

      {(this.state.topics.length > 0 && this.state.displayMode === 'topics')
        && <Topics topics={this.state.topics}
                   userId={this.state.session.id}
                   hitServer={this.hitServer}
                   display={this.display.bind(this)}
                   showModal={this.showModal.bind(this)}
                   updateTopicId={this.updateTopicId.bind(this)}
                   updateModalUserMessage={this.updateModalUserMessage.bind(this)}
                   /> }

      {(this.state.takeaways.length > 0 && this.state.displayMode === 'takeaways')
        && <Takeaways takeaways={this.state.takeaways} createTakeaway={this.createTakeaway.bind(this)} />}
    </div>)
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
