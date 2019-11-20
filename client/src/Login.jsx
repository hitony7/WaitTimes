import React, { Component } from 'react';
import { Form, Icon, Input, Button, Alert, List } from 'antd';
import { Redirect } from "react-router-dom";
// import $ from 'jquery';
import axios from 'axios';
const querystring = require('querystring');


class Login extends Component {

  state = {
    redirect: false,
    register: false,
    serverResponse: '',
  }
  // componentDidUpdate() {
  //   if (this.state.redirect) {
  //     this.setState({ redirect: false })
  //   }
  // }

  login = e => {
    e.preventDefault();
    this.setState({ serverResponse: '' });
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
          .catch((error) => {
            if (error.response) {
              // The request was made and the server responded with a status code
              // that falls out of the range of 2xx
              // console.log(error.response.data);
              // console.log(error.response.status);
              if (error.response.status === 401) {
                this.setState({ serverResponse: 'Incorrect credentials' });
              }
              if (error.response.status === 500) {
                this.setState({ serverResponse: 'The server is either not responding or may not be configured correctly.' });
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
      return this.props.role === 'triage_staff' ? <Redirect to='/admin' /> : <Redirect to='/patient' />;
    }
    if (this.state.register) {
      return <Redirect to='/register' />
    }
    return (
      <div className="sign-in">
        <Alert
          message="Warning"
          description="If this is a real emergency, close this app and dial 911!"
          type="error"
          closable
        />
        <p className="welcome-para">Welcome to VisitER, the online check-in system for non-life-threatening emergency room (ER) visits for children with Autism Spectrum Disorder (ASD). After electronically submitting your request to the triage staff, you will be given a wait time so that you may arrive in the ER once a physician is ready to see your child. This way you avoid waiting at the hospital.</p>
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
          {this.state.serverResponse && <Alert
            message="Error"
            closable
            type="error"
            description={this.state.serverResponse}
          />}
        </Form>
        <Button onClick={this.register}>Register</Button>

      </div>
    );
  }
}
const WrappedNormalLoginForm = Form.create({ name: 'normal_login' })(Login);

export default WrappedNormalLoginForm;
