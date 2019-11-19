import React, { Component } from 'react';
import { Form, Icon, Input, Button } from 'antd';
import { Redirect } from "react-router-dom";
// import $ from 'jquery';
import axios from 'axios';
import NOT_LOGGED_IN from './App.js';

class Admin extends Component {

  state = {
    redirect: false,
    message: 'Welcome to the triage admin panel. Here we will list all incoming ER-visit requests and assign them a wait time.',
  }


  // componentDidUpdate() {
  //   if (this.state.redirect) {
  //     this.setState({ redirect: false })
  //   }
  // }


  render() {
    // const { getFieldDecorator } = this.props.form;
    if (this.state.redirect) {
      return (<Redirect to='/admin' />)
    }
    if (this.state.loggedInStatus === NOT_LOGGED_IN) {
      return (<Redirect to='/' />)
    }
    return (
      <div>
        <h1>Admin Panel</h1>
        <h2>{this.state.message}</h2>
      </div>
    );
  }
}

export default Admin;