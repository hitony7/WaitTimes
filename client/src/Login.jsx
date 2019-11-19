import React, { Component } from 'react';
import { Form, Icon, Input, Button, Alert } from 'antd';
import { Redirect } from "react-router-dom";
// import $ from 'jquery';
import axios from 'axios';
const querystring = require('querystring');


class Login extends Component {

  state = {
    redirect: false,
    register: false
  }
  // componentDidUpdate() {
  //   if (this.state.redirect) {
  //     this.setState({ redirect: false })
  //   }
  // }

  login = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const requestJSONobj = { "email": values.email.toLowerCase(), "password": values.password };
        axios.post('api/login', querystring.stringify(requestJSONobj))
          .then((response) => {
            // console.log('Server response', response);
            localStorage.setItem("token", response.data.token);
            this.props.setUser(values.email); // set the user's email in the React state
            this.props.setRole(response.data.role); // set the user's email in the React state
            this.setState({ redirect: true }); // trigger a redirect once logged in and state updated
          })
          .catch(function (error) {
            if (error.response) {
              // The request was made and the server responded with a status code
              // that falls out of the range of 2xx
              // console.log(error.response.data);
              // console.log(error.response.status);
              if (error.response.status === 401) {
                window.alert('Login Error: Incorrect credentials');
              }
              if (error.response.status === 500) {
                window.alert('Server Error: The server is either not running or may not be configured correctly.');
              }
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

  register = e => {
    e.preventDefault();
    this.setState({ register: true });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    if (this.state.redirect) {
      return this.props.role === 'triage_staff' ? <Redirect to='/admin' /> : <Redirect to='/event' />;
    }
    if (this.state.register) {
      return <Redirect to='/register' />
    }
    return (
      <div className="sign-in">
        <Alert
          message="Warning: If this is a real emergency, do not use this app but instead dial 911!"
          type="error"
        />
        <p className="welcome-para">Welcome to VisitER. Please sign in below.</p>
        <h2>Sign In</h2>
        <Form onSubmit={this.login} className="login-form">
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
            <Button htmlType="submit">
              Login
          </Button>
          </Form.Item>
        </Form>
        <Button onClick={this.register}>Register</Button>

      </div>
    );
  }
}
const WrappedNormalLoginForm = Form.create({ name: 'normal_login' })(Login);

export default WrappedNormalLoginForm;
