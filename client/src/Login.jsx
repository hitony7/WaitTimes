import React, { Component } from 'react';
import { Form, Icon, Input, Button, Alert } from 'antd';
import { Redirect } from "react-router-dom";
// import $ from 'jquery';
import axios from 'axios';

class Login extends Component {

  state = {
    redirect: false
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
        // this.props.cookies.set("email", values.email, { path: '/' })
        // this.props.setUser(this.props.cookies.get('email'))
        // this.setState({redirect:true})
        // axios.post('/api/users', {email: this.props.cookies.get('email')})
        const requestJSONobj = { "auth": { "email": values.email, "password": values.password } };
        console.log(requestJSONobj);
        axios.post('api/user_token', requestJSONobj)
          .then((response) => {
            // console.log(response);
            localStorage.setItem("jwt", response.data.jwt); // this instead of a cookie; from https://codebrains.io/rails-jwt-authentication-with-knock/
            this.props.setUser(values.email); // set the user's email in the React state
            this.setState({ redirect: true }); // trigger a redirect once logged in and state updated
          })
          .catch(function (error) {
            window.alert('Error: Incorrect credentials');
            console.log(error);
          });
      }
    });

  };

  render() {
    const { getFieldDecorator } = this.props.form;
    if (this.state.redirect) {
      return (<Redirect to='/admin' />)
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

      </div>
    );
  }
}
const WrappedNormalLoginForm = Form.create({ name: 'normal_login' })(Login);

export default WrappedNormalLoginForm;
