import React, { Component } from 'react';
import { Form, Icon, Input, Button, Radio, Alert, List } from 'antd';
import { Redirect } from "react-router-dom";
import axios from 'axios';
const querystring = require('querystring');

class Register extends Component {

  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
      radio: 'caregiver',
      message: 'Register as a new user here. All fields are required.',
      serverResponse: '',
      serverResponseErrors: null
    };
    this.updateRadioButton = this.updateRadioButton.bind(this);
  }


  // componentDidUpdate() {
  //   if (this.state.redirect) {
  //     this.setState({ redirect: false })
  //   }
  // }

  updateRadioButton(value) {
    this.setState({ radio: value.target.value });
  }

  cancel = e => {
    e.preventDefault();
    this.setState({ redirect: true });
  }

  submitRegistration = e => {
    e.preventDefault();
    this.setState({ serverResponse: '' }); // clear before submitting if alerts already displayed
    this.setState({ serverResponseErrors: null }); // clear before submitting if alerts already displayed
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const requestJSONobj = {
          "first_name": values.first_name,
          "last_name": values.last_name,
          "email": values.email.toLowerCase(),
          "phone": values.phone,
          "password": values.password,
          "password_confirmation": values.password_confirmation,
          "role": this.state.radio
        };
        // console.log(requestJSONobj);
        axios.post('api/users', querystring.stringify(requestJSONobj))
          .then((response) => {
            this.setState({ serverResponse: 'Registration successful, redirecting to homepage…' });
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
      return (<Redirect to='/' />)
    }
    return (
      <div className="sign-in">
        <h1>User Registration</h1>
        <h2>{this.state.message}</h2>

        <Form onSubmit={this.submitRegistration} className="registration-form">
          <Form.Item>
            {getFieldDecorator('first_name', {
              rules: [{ required: true, message: 'Please input your first name!' }],
            })(
              <Input
                prefix={<Icon type="file-text" style={{ color: 'rgba(0,0,0,.25)' }} />}
                name="first_name"
                id="first_name"
                type="text"
                placeholder="First name"
              />
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('last_name', {
              rules: [{ required: true, message: 'Please input your last name!' }],
            })(
              <Input
                prefix={<Icon type="file-text" style={{ color: 'rgba(0,0,0,.25)' }} />}
                name="last_name"
                id="last_name"
                type="text"
                placeholder="Last name"
              />
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('email', {
              rules: [{ required: true, message: 'Please input your email!' }],
            })(
              <Input
                prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />}
                name="email"
                id="email"
                type="email"
                placeholder="E-mail address"
              />
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('phone', {
              rules: [{ required: true, message: 'Please input your phone!' }],
            })(
              <Input
                prefix={<Icon type="phone" style={{ color: 'rgba(0,0,0,.25)' }} />}
                name="phone"
                id="phone"
                type="text"
                placeholder="Phone Number"
              />
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('password', {
              rules: [{ required: true, message: 'Please input your password!' }],
            })(
              <Input
                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                name="password"
                id="password"
                type="password"
                placeholder="Password"
              />
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('password_confirmation', {
              rules: [{ required: true, message: 'Please confirm your password!' }],
            })(
              <Input
                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                name="password_confirmation"
                id="password_confirmation"
                type="password"
                placeholder="Confirm Password"
              />
            )}
          </Form.Item>
          <Form.Item>
            <Radio.Group defaultValue="caregiver" buttonStyle="solid" onChange={this.updateRadioButton}>
              <Radio.Button value="caregiver">Caregiver of patient</Radio.Button>
              <Radio.Button value="triage_staff">Hospital triage staff</Radio.Button>
            </Radio.Group>
          </Form.Item>
          <Form.Item>
            <Button htmlType="submit">
              Register
          </Button>
          </Form.Item>
          {this.state.serverResponse && <Alert
            message="Registration Succesful"
            description="Redirecting to the sign-in page…"
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
      </div>
    );
  }
}

const RegistrationForm = Form.create({ name: 'registration' })(Register);

export default RegistrationForm;