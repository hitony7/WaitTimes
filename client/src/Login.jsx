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

  // handleSubmit = e => {
  //   e.preventDefault();
  //   this.props.form.validateFields((err, values) => {
  //     if (!err) {
  //       this.props.cookies.set("email", values.email, { path: '/' })
  //       this.props.setUser(this.props.cookies.get('email'))
  //       this.setState({ redirect: true })
  //       axios.post('/api/users', { email: this.props.cookies.get('email') })
  //     }
  //   });
  // };

  login() {
    const email = $("#email").val();
    const password = $("#password").val();
    const request = { "auth": { "email": email, "password": password } };
    console.log(request);
    axios.post('api/user_token', request).then((response) => {
      console.log(response);
      localStorage.setItem("jwt", response.jwt)
    });
    // $.ajax({
    //   url: "http://localhost:3000/api/user_token",
    //   type: "POST",
    //   data: request,
    //   dataType: "json",
    //   success: function (result) {
    //     console.log(result)
    //     localStorage.setItem("jwt", result.jwt)
    //   }
    // })
  }

  render() {
    return (
      <div className="App">
        <Form>
          <label htmlFor="email">Email: </label>
          <br />
          <Input
            name="email"
            id="email"
            type="email"
          />
          <br /><br />
          <label htmlFor="password">Password:</label>
          <br />
          <Input
            name="password"
            id="password"
            type="password"
          />
        </Form>
        <br />
        <Button
          onClick={this.login}
        >
          Login
          </Button>
        <br />
        <p>{this.state}</p>
      </div>
    );
  }
}
const WrappedNormalLoginForm = Form.create({ name: 'normal_login' })(Login);

export default WrappedNormalLoginForm;
