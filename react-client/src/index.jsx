import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import Users from './components/Users.jsx';
import Welcome from './components/Welcome.jsx';
import Takeaways from './components/Takeaways.jsx';
import ModalView from './components/ModalView.jsx';
import Topics from './components/Topics.jsx';


var takeaways = [
  {id : 1, usernameQ : 'Kurt',   usernameA : 'Kamie',  date : '06/21/17', topic : 'Why are frameworks so burdensome', takeaway : 'Adulting is hard.'},
  {id : 2, usernameQ : 'Kamie',  usernameA : 'Azmeer', date : '06/23/17', topic : 'Promisifying',                     takeaway : 'Don\'t just *do* something, *SIT* there!'},
  {id : 3, usernameQ : 'Reuben', usernameA : 'David',  date : '06/25/17', topic : 'Is Angular God?',                  takeaway : 'Apparently \'i\' is just an *imaginary* number.'},
  {id : 4, usernameQ : 'Ben',    usernameA : 'Daniel', date : '06/28/17', topic : 'Breaking Promises',                takeaway : 'Now we know *why* there is a no-open-drink-container rule.'},
  {id : 5, usernameQ : 'Saikal', usernameA : 'Saloni', date : '06/29/17', topic : 'Where are my car keys?',           takeaway : 'Who knew semi-colons and colons were different things??'},
  ];

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      topics: [],
      session: {},
      takeaways: takeaways,
      showModal: false,
      inviteSubmitted: false
    }
  }

  hitServer(url, data, method = 'GET', dataType = 'json') {
    return $.ajax({
      url: url,
      method: method,
      contentType: method === 'POST' ? 'application/json' : 'application/x-www-form-urlencoded; charset=UTF-8',
      data: JSON.stringify(data),
      dataType: method === 'POST' ? 'html' : dataType
    })
  }

  gitHubSignIn() {
    let clientId = '0e43b859aea47726fa84';
    let scopes = 'user';
    window.open(`https://github.com/login/oauth/authorize?client_id=${clientId}&scope=${scopes}`, '_self');
  }

  getUserSession() { // get a user if they have a session
    // debugger;
    this.hitServer('/session')
      .then(user => {
        if(user.length) {
          this.setState({
            session: user[0]
          });
        }
      });
  }

  addTakeaway() {
    let data = {user_id : '10', takeaway : 'We should have practiced writing Mocha tests...'};

    this.hitServer('/takeaways', data, 'POST')
      .then(results => {
        console.log('TAKEAWAYS RETURNED = ', data);
        this.displayTakeaways();
      })
      .catch(err => {
        console.error('ERROR RETRIEVING TAKEAWAYS: ', err);
      });
  }

  displayTakeaways() {
    this.hitServer('/takeaways')
    .then(takeaways => { // expect takeaways to be an array of takeaway objects
        console.log('TAKEAWAYS RETURNED = ', takeaways);
        this.setState({
          takeaways: takeaways
        });
      })
    .catch(err => {
      console.error('ERROR RETRIEVING TAKEAWAYS: ', err);
    });
  }

  componentWillMount() { // A lifecycle event that each component has (before render)
  }

  componentDidMount() { // A lifecycle event that each component has (after render)
    // Render has already occurred; Get users from database.
    this.getUserSession();
    this.display('/users');
    this.display('/topics')
  }

  showModal() {
    this.setState({showModal: true});
  }

  closeModal() {
    this.setState({
      showModal: false,
      inviteSubmitted: false
    });
  }

  post(event) { // post a topic
    event.preventDefault();
    let topic = event.currentTarget.form.firstChild.value;
    if(!topic.length) {
      alert("Did you forget something?_O");
      return;
    }

    // figure out sanitation
    this.hitServer('/topics', {topic}, 'POST')
      .then(response => {
        this.setState({inviteSubmitted: true});
        this.display('/topics');
      })
      .catch(err => {
        console.log('Error posting a topic ', err);
      });
  }


  display(path) {
    this.hitServer(path)
      .then(stateObj => { // expect stateObj to be {property: value}
        this.setState(stateObj);
      })
      .catch(err => {
        debugger;
        console.error('error displaying state: ', err);
      });

  }

  render () {
    return (<div>
      <button onClick={this.showModal.bind(this)}>Post</button>
      <h1>Gravitas</h1>
      <ModalView
        show={this.state.showModal}
        closeMethod={this.closeModal.bind(this)}
        post={this.post.bind(this)}
        submitted={this.state.inviteSubmitted}
      />
      {Object.keys(this.state.session).length > 0 &&
      <Welcome session={this.state.session} /> }

      {this.state.topics.length > 0 && <Topics topics={this.state.topics} /> }
      {Object.keys(this.state.session).length === 0 &&
      <button onClick={this.gitHubSignIn.bind(this)}> Sign in with GitHub</button>}
      <Users users={this.state.users}  />
      <h1>APP COMPONENT</h1>
      <Takeaways takeaways={this.state.takeaways} addTakeaway={this.addTakeaway.bind(this)} />
    </div>)
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
