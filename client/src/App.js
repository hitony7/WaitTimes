import React, { Component } from 'react';
import './App.css';
import 'antd/dist/antd.css';
import { Button } from 'antd';
import Login from './Login.jsx';
import Admin from './Admin.jsx';
import Patient from './Patient.jsx';
import Register from './Register.jsx';
import Event from './Event.jsx';
import Caregiver from './Caregiver.jsx';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Redirect } from "react-router-dom";
// import ActionCable from "action-cable-react-jwt";


const LOGGED_IN = 'LOGGED_IN';
const NOT_LOGGED_IN = 'NOT_LOGGED_IN';
let jwt_token = localStorage.getItem("token");

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loggedInStatus: jwt_token ? LOGGED_IN : NOT_LOGGED_IN,
      email: '',
      role: 'caregiver',
      patient_id: null,
      patient_name: '',
      er_visit_id: null,
      global_disclaimer: 'If your child is experiencing life-threatening injuries, please go to your nearest emergency department or call 9-1-1. If your child is unconscious, has been in a car accident, is having difficulty breathing, or will not stop seizing (having a seizure), call 9-1-1. Also note that this app is a proof of concept and is not production-quality code.',
      text: ''
    };
  }

  // componentDidMount() {
  //   const cable = ActionCable.createConsumer('ws://localhost:3001/api/cable', jwt_token);
  //   this.sub = cable.subscriptions.create('NotesChannel', {
  //     received: this.handleReceiveNewText
  //   })
  // }

  // handleReceiveNewText = ({ text }) => {
  //   if (text !== this.state.text) {
  //     this.setState({ text })
  //   }
  // }

  // handleChange = e => {
  //   this.setState({ text: e.target.value })
  //   this.sub.send({ text: e.target.value, id: 1 })
  // }

  setUser = email => {
    this.setState({ email: email });
    this.setState({ loggedInStatus: LOGGED_IN });
  };

  setPatient = (patientObject) => {
    this.setState({ patient_id: patientObject.patient_id });
    this.setState({ patient_name: patientObject.patient_name });
  };

  setVisitId = (id) => {
    this.setState({ er_visit_id: id });
  }

  formatDateFromUTCString = date => {
    // from https://stackoverflow.com/questions/50430968/converting-string-date-in-react-javascript
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    return new Date(date).toLocaleDateString([], options);
  }

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
          <div className="navbar-right">{this.state.loggedInStatus === LOGGED_IN && <Button onClick={this.logout}>Log Out</Button>
          }</div>
        </nav>
        <div className="App">
          <Switch>
            <Route
              path="/admin"
              render={(props) => (this.state.loggedInStatus === LOGGED_IN && this.state.role === 'triage_staff') ? <Admin {...props} formatDateFromUTCString={this.formatDateFromUTCString} /> : <Redirect to='/' />}
            />
            <Route
              path="/caregiver"
              render={(props) => (this.state.loggedInStatus === LOGGED_IN && this.state.role === 'caregiver') ? <Caregiver {...props} setPatient={this.setPatient} formatDateFromUTCString={this.formatDateFromUTCString} /> : <Redirect to='/' />}
            />
            <Route
              path="/patient"
              render={(props) => (this.state.loggedInStatus === LOGGED_IN && this.state.role === 'caregiver') ? <Patient {...props} setPatient={this.setPatient} /> : <Redirect to='/' />}
            />
            <Route
              path="/event"
              render={(props) => (this.state.loggedInStatus === LOGGED_IN && this.state.role === 'caregiver' && this.state.patient_id) ? <Event {...props} patient_id={this.state.patient_id} patient_name={this.state.patient_name} setVisitId={this.setVisitId} /> : <Redirect to='/' />}
            />
            <Route
              path="/register"
              render={(props) => (this.state.loggedInStatus === NOT_LOGGED_IN) ? <Register {...props} /> : <Redirect to='/' />}
            />
            <Route
              path="/"
              render={props => (
                <Login {...props} setUser={this.setUser} setRole={this.setRole} role={this.state.role} global_disclaimer={this.state.global_disclaimer} />
              )}
            />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
