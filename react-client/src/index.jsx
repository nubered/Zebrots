import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import Users from './components/Users.jsx';
import Welcome from './components/Welcome.jsx';
import Takeaways from './components/Takeaways.jsx';

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
      session: {},
      takeaways : takeaways
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

  addUser() {
    let data = {name: 'beth', email: 'beth@gmail.com', gitHub: '14hj3kl3h4k1h4k3'};

    this.hitServer('/users', data, 'POST')
      .then(results => {
        console.log('these are the results ', data);
        this.displayUsers();
      })
      .catch(err => {
        console.error('we have a error ', err);
      });
  }

  getUserSession() { // get a user if they have a session
    // debugger;
    this.hitServer('/session')
      .then(session => {
        if(session.uid) {
          this.setState({
            session: session
          });
        }
      });
  }

  displayUsers() {
    this.hitServer('/users')
    .then(users => { // expect users to be an array of user objects
        console.log('these are the results ', users);
        this.setState({
          users: users
        });
      })
    .catch(err => {
      console.error('we have a error ', err);
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
    this.displayUsers();

  }

  render () {
    return (<div>
      <h1>Gravitas</h1>
      {Object.keys(this.state.session).length > 0 &&
      <Welcome session={this.state.session} /> }
      {Object.keys(this.state.session).length === 0 &&
      <button onClick={this.gitHubSignIn.bind(this)}> Sign in with GitHub</button>}
      <Users users={this.state.users}  />
      <h1>APP COMPONENT</h1>
      <Takeaways takeaways={this.state.takeaways} addTakeaway={this.addTakeaway.bind(this)} />
    </div>)
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
