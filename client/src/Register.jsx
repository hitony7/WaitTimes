import React, { Component } from 'react';
import { Form, Icon, Input, Button } from 'antd';
import { Redirect } from "react-router-dom";
// import $ from 'jquery';
import axios from 'axios';
import NOT_LOGGED_IN from './App.js';

class Register extends Component {

  state = {
    redirect: false,
    message: 'Welcome to the new user registration page.',
  }


  // componentDidUpdate() {
  //   if (this.state.redirect) {
  //     this.setState({ redirect: false })
  //   }
  // }

  cancel = e => {
    e.preventDefault();
    this.setState({ redirect: true });
  }


  render() {
    // const { getFieldDecorator } = this.props.form;
    if (this.state.redirect) {
      return (<Redirect to='/' />)
    }
    return (
      <div>
        <h1>Register</h1>
        <h2>{this.state.message}</h2>
        <Button onClick={this.cancel}>Cancel</Button>
      </div>
    );
  }
}

export default Register;