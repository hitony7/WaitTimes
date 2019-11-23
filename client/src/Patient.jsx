
import React, { Component } from 'react';
import { Form, Icon, Input, Button, Alert, List } from 'antd';
import { Redirect } from "react-router-dom";
import axios from 'axios';
import NOT_LOGGED_IN from './App.js';
const querystring = require('querystring');


class Patient extends Component {

  state = {
    redirect: false,
    message: 'Please input your patient’s data below:',
    serverResponse: '',
    serverResponseErrors: null,
    cancelRedirect: false
  }

  cancel = e => {
    e.preventDefault();
    this.setState({ cancelRedirect: true });
  }


  // componentDidUpdate() {
  //   if (this.state.redirect) {
  //     this.setState({ redirect: false })
  //   }
  // }


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
          "age": values.age,
          "allergies": values.allergies,
          "gender": values.gender,
          "caregiver_relationship": values.caregiver_relationship
        };
        // console.log(requestJSONobj);
        const token = localStorage.getItem("token");
        const config = {
          headers: { 'Authorization': "Bearer " + token }
        };
        axios.post('api/patient', querystring.stringify(requestJSONobj), config)
          .then((response) => {
            this.setState({ serverResponse: 'Redirecting…' });
            this.props.setPatient({ patient_id: response.data.id, patient_name: response.data.name });
            setTimeout(function () { //Start the timer
              this.setState({ redirect: true }) //After 1 second, set redirect to true
            }.bind(this), 1000);
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
      return (<Redirect to='/event' />)
    }
    if (this.state.cancelRedirect) {
      return (<Redirect to='/caregiver' />)
    }
    if (this.state.loggedInStatus === NOT_LOGGED_IN) {
      return (<Redirect to='/' />)
    }
    return (
      <main className="sign-in">
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
              rules: [{ required: true, max: 3, message: 'Please input your patient’s age (up to three digits)!' }],
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
              rules: [{ required: true, max: 9, message: 'Please input your patient’s healthcare number (up to 10 digits)!' }],
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
            {getFieldDecorator('gender', {
              rules: [{ required: true, message: 'Please input your patient’s gender!' }],
            })(
              <Input
                prefix={<Icon type="file-text" style={{ color: 'rgba(0,0,0,.25)' }} />}
                name="gender"
                id="gender"
                type="text"
                placeholder="Gender"
              />
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('allergies', {
              rules: [{ required: true, message: 'Please input your patient’s allergies!' }],
            })(
              <Input
                prefix={<Icon type="file-text" style={{ color: 'rgba(0,0,0,.25)' }} />}
                name="allergies"
                id="allergies"
                type="text"
                placeholder="Allergies"
              />
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('caregiver_relationship', {
              rules: [{ required: true, message: 'Please input your relationship to the patient!' }],
            })(
              <Input
                prefix={<Icon type="file-text" style={{ color: 'rgba(0,0,0,.25)' }} />}
                name="caregiver_relationship"
                id="caregiver_relationship"
                type="text"
                placeholder="Your relationship to the patient"
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
        <Button onClick={this.cancel}>Cancel</Button>

      </main>
    );
  }
}

const PatientForm = Form.create({ name: 'patient' })(Patient);

export default PatientForm;