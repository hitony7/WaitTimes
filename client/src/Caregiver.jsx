import React, { Component } from 'react';
import { Button, Table, notification } from 'antd';
import { Redirect } from "react-router-dom";
import axios from 'axios';
import NOT_LOGGED_IN from './App.js';
import ActionCable from "action-cable-react-jwt";

class Caregiver extends Component {

  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
      message: 'Welcome to the caregiver dashboard. Here you can see your existing ER requests and associated wait times as well as create new ER visits.',
      error: null,
      isLoaded: false,
      visits: [],
      text: '',
      currentVisit: {},
      showNotice: false
    }
  }


  handleReceiveNewText = (e) => {
    console.log(e)
    let now = new Date();
    now.setMinutes( now.getMinutes() + Number(e.waitTime));
    const args = {
      message: `Case ${e.visitId} has been reviewed`,
      description:
        `Your case has been assigned a wait time of ${e.waitTime} minutes with comment "${e.comment}". Please arrive at ${this.props.formatDateFromUTCString(now)}.`,
      duration: 0,
      className: 'red-notice'
    };
    notification.open(args);

    // if (text !== this.state.text) {
    //   console.log({ visitId });
    //   this.setState({ text })
    // }
  }

  handleChange = e => {
    this.setState({ text: e.target.value })
    this.sub.send({ text: e.target.value, id: 1 })
  }

  componentDidMount() {
    const token = localStorage.getItem("token");
    const cable = ActionCable.createConsumer('ws://localhost:3001/api/cable', token);
    this.sub = cable.subscriptions.create('NotesChannel', {
      received: this.handleReceiveNewText
    })
    const config = {
      headers: { 'Authorization': "Bearer " + token }
    };
    axios
      .get('/api/event', config) // let's grab the triage questions from the database
      .then(response => {
        // handle success
        for (const item of response.data) { // let's do some date updating
          item.event_date = this.props.formatDateFromUTCString(item.event_date);
        }
        this.setState({
          isLoaded: true,
          visits: response.data,
        });
      },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        });
  }

  // componentDidUpdate() {
  //   if (this.state.redirect) {
  //     this.setState({ redirect: false })
  //   }
  // }

  newVisit = e => {
    e.preventDefault();
    this.setState({ redirect: true });
  }


  render() {
    const { error, isLoaded, visits } = this.state;
    const columns = [
      {
        title: 'Patient Name',
        dataIndex: 'name'
      },
      {
        title: 'Age',
        dataIndex: 'age',
      },
      {
        title: 'Address',
        dataIndex: 'address',
      },
      {
        title: 'Submission Date',
        dataIndex: 'event_date',
      },
      {
        title: 'Visit Description',
        dataIndex: 'visit_description',
      },
      {
        title: 'Given Wait Time (minutes)',
        dataIndex: 'given_wait_time_minutes',
      },
    ];
    if (this.state.redirect) {
      return (<Redirect to='/patient' />)
    }
    if (this.state.loggedInStatus === NOT_LOGGED_IN) {
      return (<Redirect to='/' />)
    }
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <main>
          <h1>Caregiver Dashboard</h1>
          <p>{this.state.message}</p>
          <h2 style={{ color: 'red' }}>New ER Visit</h2>
          <Button onClick={this.newVisit} type="danger">New Emergency Room Visit</Button>
          <h2>Pending ER Visits</h2>
          <Table columns={columns} dataSource={visits} rowKey={visits => visits.id} scroll={{ x: 800 }} />
        </main>
      );
    }
  }
}

export default Caregiver;