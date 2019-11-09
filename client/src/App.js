import React, { Component } from 'react';
import axios from 'axios';
import './App.css';
import Cookies from 'universal-cookie';
// import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import 'antd/dist/antd.css';
import { Button } from 'antd';

const cookies = new Cookies();

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: 'Welcome to VisitER! Click the button below to load data!',
      email: cookies.get('email')
    };
  }

  setUser = email => {
    this.setState({ email: email }, () =>
      console.log('Current state after setting user', this.state)
    );
  };

  fetchData = () => {
    axios
      .get('/api/data') // You can simply make your requests to "/api/whatever you want"
      .then(response => {
        // handle success
        console.log(response.data); // The entire response from the Rails API

        console.log(response.data.message); // Just the message
        this.setState({
          message: response.data.message
        });
      });
  };

  render() {
    return (
      <div className="App">
        <h1>
          Visit<span>ER</span>
        </h1>
        <h2>{this.state.message}</h2>
        <Button onClick={this.fetchData}>Fetch Data</Button>
      </div>
    );
  }
}

export default App;
