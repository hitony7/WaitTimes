

import React, { Component } from 'react';
import { Form, Icon, Input, Button, Alert, List } from 'antd';
import { Redirect } from "react-router-dom";
import axios from 'axios';
import NOT_LOGGED_IN from './App.js';
const querystring = require('querystring');
const { TextArea } = Input;


class Event extends Component {

  state = {
    redirect: false,
    message: 'Please provide some details for your upcoming ER visit:',
    serverResponse: '',
    serverResponseErrors: null,
    triageQuestions: null
  }

  cancel = e => {
    e.preventDefault();
    this.setState({ redirect: true });
  }


  // componentDidUpdate() {
  //   if (this.state.redirect) {
  //     this.setState({ redirect: false })
  //   }
  // }

  getTriageQuestions = () => {
    const token = localStorage.getItem("token");
    const config = {
      headers: { 'Authorization': "Bearer " + token }
    };
    // console.log(config);
    axios
      .get('/api/triage_questions', config) // You can simply make your requests to "/api/whatever you want"
      .then(response => {
        // handle success
        // console.log(response.data); // The entire response from the Rails API
        // console.log(response.data.message); // Just the message
        this.setState({
          triageQuestions: response.data
        });
      });
  };

  startEmergencyEvent = e => {
    e.preventDefault();
    this.setState({ serverResponse: '' }); // clear before submitting if alerts already displayed
    this.setState({ serverResponseErrors: null }); // clear before submitting if alerts already displayed
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const requestJSONobj = {
          "visit_description": values.visit_description,
          "emergency_rooms_id": 2
        };
        // console.log(requestJSONobj);
        const token = localStorage.getItem("token");
        const config = {
          headers: { 'Authorization': "Bearer " + token }
        };
        axios.post('api/event', querystring.stringify(requestJSONobj), config)
          .then((response) => {
            this.setState({ serverResponse: 'Redirecting…' });
            // this.props.setPatient({ patient_id: response.data.id, patient_name: response.data.name });
            // setTimeout(function () { //Start the timer
            //   this.setState({ redirect: true }) //After 1 second, set redirect to true
            // }.bind(this), 1000);
          })
          .catch((error) => {
            if (error.response) {
              this.setState({ serverResponseErrors: error.response.data.errors });
              // The request was made and the server responded with a status code
              // that falls out of the range of 2xx
              console.log('error response data', error.response.data.errors);
              console.log(error.response.data);
              console.log(error.response.status);
              console.log(error.response.headers);

            } else if (error.request) {
              // The request was made but no response was received
              // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
              // http.ClientRequest in node.js
              console.log(error.request);
            } else {
              // Something happened in setting up the request that triggered an Error
              console.log('Error', error.message);
            }
            console.log(error.config);
          });
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    if (this.state.redirect) {
      return (<Redirect to='/questions' />)
    }
    if (this.state.loggedInStatus === NOT_LOGGED_IN) {
      return (<Redirect to='/' />)
    }
    return (
      <div className="sign-in">
        <Alert
          message="Warning"
          description="If this is a real emergency, close this app and dial 911!"
          type="error"
          closable
        />
        <h1>New ER Visit for {this.props.patient_name}</h1>
        <h2>{this.state.message}</h2>

        <Form onSubmit={this.startEmergencyEvent} className="registration-form">
          <Form.Item>
            {getFieldDecorator('visit_description', {
              rules: [{ required: true, message: 'Please input a description!' }],
            })(
              <TextArea
                rows={5}
                name="visit_description"
                id="visit_description"
                type="text"
                placeholder="Give a quick summary of your emergency."
              />
            )}
          </Form.Item>
          <Form.Item>
            <Button htmlType="submit">
              Submit
          </Button>
          </Form.Item>
          {this.state.serverResponse && <Alert
            message="Event Initiation Succesful"
            description={this.state.serverResponse}
            type="success"
            showIcon
          />}
          {this.state.serverResponseErrors && <List
            header={<h2>Error!</h2>}
            bordered
            dataSource={this.state.serverResponseErrors}
            renderItem={item => <List.Item>{item}</List.Item>}
          />}
        </Form>

      </div>
    );
  }
}

const EventForm = Form.create({ name: 'patient' })(Event);

export default EventForm;