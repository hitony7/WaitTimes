
import React, { Component } from 'react';
import { Form, Icon, Input, Button, Alert, List } from 'antd';
import { Redirect } from "react-router-dom";
import axios from 'axios';
import NOT_LOGGED_IN from './App.js';
const querystring = require('querystring');


class Event extends Component {

  state = {
    redirect: false,
    message: 'Please input your patient’s data below:',
    serverResponse: '',
    serverResponseErrors: null,
    patient_id: null
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
          message: response.data[0].question_text
        });
      });
  };

  submitPatientRegistration = e => {
    e.preventDefault();
    this.setState({ serverResponse: '' }); // clear before submitting if alerts already displayed
    this.setState({ serverResponseErrors: null }); // clear before submitting if alerts already displayed
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const requestJSONobj = {
          "ahc_number": values.ahc_number,
          "address": values.address,
          "name": values.name,
          "age": values.age
        };
        // console.log(requestJSONobj);
        const token = localStorage.getItem("token");
        const config = {
          headers: { 'Authorization': "Bearer " + token }
        };
        axios.post('api/patient', querystring.stringify(requestJSONobj), config)
          .then((response) => {
            this.setState({ serverResponse: 'Redirecting…' });
            this.setState({ patient_id: response.data.id });
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
      return (<Redirect to='/' />)
    }
    if (this.state.loggedInStatus === NOT_LOGGED_IN) {
      return (<Redirect to='/' />)
    }
    return (
      <div className="sign-in">
        <h1>Patient Registration</h1>
        <h2>{this.state.message}</h2>

        <Form onSubmit={this.submitPatientRegistration} className="registration-form">
          <Form.Item>
            {getFieldDecorator('name', {
              rules: [{ required: true, message: 'Please input your patient’s name!' }],
            })(
              <Input
                prefix={<Icon type="file-text" style={{ color: 'rgba(0,0,0,.25)' }} />}
                name="name"
                id="name"
                type="text"
                placeholder="Name"
              />
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('age', {
              rules: [{ required: true, message: 'Please input your patient’s age!', max: 3, message: 'Maximum 3 digits!'  }],
            })(
              <Input
                prefix={<Icon type="file-text" style={{ color: 'rgba(0,0,0,.25)' }} />}
                name="age"
                id="age"
                type="text"
                placeholder="Age"
              />
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('ahc_number', {
              rules: [{ required: true, message: 'Please input your patient’s AHC number!', max: 10, message: 'Maximum 10 digits!'  }],
            })(
              <Input
                prefix={<Icon type="file-text" style={{ color: 'rgba(0,0,0,.25)' }} />}
                name="ahc_number"
                id="ahc_number"
                type="text"
                placeholder="Alberta Healthcare Number"
              />
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('address', {
              rules: [{ required: true, message: 'Please input your patient’s address!' }],
            })(
              <Input
                prefix={<Icon type="file-text" style={{ color: 'rgba(0,0,0,.25)' }} />}
                name="address"
                id="address"
                type="text"
                placeholder="Address"
              />
            )}
          </Form.Item>
          <Form.Item>
            <Button htmlType="submit">
              Submit
          </Button>
          </Form.Item>
          {this.state.serverResponse && <Alert
            message="Patient Registration Succesful"
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

const PatientForm = Form.create({ name: 'patient' })(Event);

export default PatientForm;