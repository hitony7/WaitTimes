import React, { Component } from 'react';
import { Form, Icon, Input, Button } from 'antd';
import { Redirect } from "react-router-dom";
// import axios from 'axios';
import NOT_LOGGED_IN from './App.js';

class Caregiver extends Component {

  state = {
    redirect: false,
    message: 'Welcome to the caregiver dashboard. Here you will see your existing ER requests (not yet implemented) and wait times as well as create new ones.',
  }


  // componentDidUpdate() {
  //   if (this.state.redirect) {
  //     this.setState({ redirect: false })
  //   }
  // }

  newVisit = e => {
    e.preventDefault();
    this.setState({ redirect: true });
  }


  render() {
    if (this.state.redirect) {
      return (<Redirect to='/patient' />)
    }
    if (this.state.loggedInStatus === NOT_LOGGED_IN) {
      return (<Redirect to='/' />)
    }
    return (
      <div>
        <h1>Caregiver Dashboard</h1>
        <h2>{this.state.message}</h2>

        <Button onClick={this.newVisit}>New Emergency Room Visit</Button>
      </div>
    );
  }
}

export default Caregiver;