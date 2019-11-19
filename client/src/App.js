import React, { Component } from 'react';
import './App.css';
import 'antd/dist/antd.css';
import { Button } from 'antd';
import Login from './Login.jsx';
import Admin from './Admin.jsx';
import Event from './Event.jsx';
// import $ from 'jquery';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Redirect } from "react-router-dom";

const LOGGED_IN = 'LOGGED_IN';
const NOT_LOGGED_IN = 'NOT_LOGGED_IN';
let jwt_token = localStorage.getItem("token");

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loggedInStatus: jwt_token ? LOGGED_IN : NOT_LOGGED_IN,
      email: '',
      role: 'caregiver'
    };
  }

  setUser = email => {
    this.setState({ email: email });
    this.setState({ loggedInStatus: LOGGED_IN });
  };

  logout = event => {
    event.preventDefault()
    // Remove the token from localStorage
    localStorage.removeItem("token");
    // Update the state
    this.setState({ loggedInStatus: NOT_LOGGED_IN, email: '' });
  };

  setRole = role => {
    this.setState({ role: role });
  };

  render() {
    return (
      <Router>
        <nav className="navbar">
          <div className="navbar-left">
            <h1>Visit<span>ER</span></h1>
          </div>
          <div className="navbar-right">{(this.state.loggedInStatus === LOGGED_IN)
            ? <Button onClick={this.logout}>Log Out</Button>
            : <Button>Register</Button>
          }</div>
        </nav>
        <div className="App">
          <Switch>
            <Route
              path="/admin"
              render={(props) => (this.state.loggedInStatus === NOT_LOGGED_IN) ? <Redirect to='/' /> : <Admin {...props} />}
            />
            <Route
              path="/event"
              render={(props) => (this.state.loggedInStatus === NOT_LOGGED_IN) ? <Redirect to='/' /> : <Event {...props} />}
            />
            <Route
              path="/"
              render={props => (
                <Login {...props} setUser={this.setUser} setRole={this.setRole} role={this.state.role} />
              )}
            />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
