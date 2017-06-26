import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import Users from './components/Users.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: []
    }
  }

  hitServer(url, data, method = 'GET', dataType = 'json') {
    return $.ajax({
      url: url,
      method: method,
      contentType: method === 'POST' ? 'application/json' : 'application/x-www-form-urlencoded; charset=UTF-8',
      data: JSON.stringify(data),
      dataType: method === 'GET' ? 'json' : 'html'
    })
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
  };

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

  componentWillMount() { // a lifecycle event that each component has (before render)
  }

  componentDidMount() { // a lifecycle event that each component has (after render)
    // Render has already occurred; Get users from database.
    this.displayUsers();
  }

  render () {
    return (<div>
      <h1>users</h1>
      <Users users={this.state.users}  addUser={this.addUser.bind(this)} />
    </div>)
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
