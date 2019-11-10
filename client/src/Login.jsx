import React, { Component } from 'react';
import { Form, Icon, Input, Button } from 'antd';
import { Redirect } from "react-router-dom";
import $ from 'jquery';
import axios from 'axios';

class Login extends Component {

  // state = {
  //   redirect: false
  // }
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
        const request = { "auth": { "email": values.email, "password": values.password } };
        console.log(request);
        axios.post('api/user_token', request).then((response) => {
          console.log(response);
          localStorage.setItem("jwt", response.jwt); // this instead of a cookie; from https://codebrains.io/rails-jwt-authentication-with-knock/
        });
      }
    });

  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="sign-in">
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

        <p>{this.state}</p>
      </div>
    );
  }
}
const WrappedNormalLoginForm = Form.create({ name: 'normal_login' })(Login);

export default WrappedNormalLoginForm;
