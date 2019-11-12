import React, { Component } from 'react';
import { Form, Icon, Input, Button } from 'antd';
import { Redirect } from "react-router-dom";
// import $ from 'jquery';
import axios from 'axios';
import NOT_LOGGED_IN from './App.js';

class Admin extends Component {

  state = {
    redirect: false,
    message: 'Welcome to VisitER! Click the button below to load data!',
  }


  // componentDidUpdate() {
  //   if (this.state.redirect) {
  //     this.setState({ redirect: false })
  //   }
  // }

  getTriageQuestions = () => {
    const token = localStorage.getItem("jwt");
    const config = {
      headers: { 'Authorization': "Bearer " + token }
    };
console.log(config);
    const bodyParameters = {
      key: "value"
    }
    axios
      .get('/api/triage_questions', config) // You can simply make your requests to "/api/whatever you want"
      .then(response => {
        // handle success
        console.log(response.data); // The entire response from the Rails API
        // console.log(response.data.message); // Just the message
        this.setState({
          message: response.data[0].question_text
        });
      });
  };

  fetchData = () => {
    axios
      .get('/api/data') // You can simply make your requests to "/api/whatever you want"
      .then(response => {
        // handle success
        // console.log(response.data); // The entire response from the Rails API
        // console.log(response.data.message); // Just the message
        this.setState({
          message: response.data.message
        });
      });
  };

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
        <h2>{this.state.message}</h2>
        <Button onClick={this.getTriageQuestions}>Fetch Data</Button>
      </div>
    );
  }
}

export default Admin;