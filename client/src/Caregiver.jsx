import React, { Component } from 'react';
import { Button, Table } from 'antd';
import { Redirect } from "react-router-dom";
import axios from 'axios';
import NOT_LOGGED_IN from './App.js';

class Caregiver extends Component {

  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
      message: 'Welcome to the caregiver dashboard. Here you can see your existing ER requests and associated wait times as well as create new ER visits.',
      error: null,
      isLoaded: false,
      visits: []
    }
  }

  componentDidMount() {
    const token = localStorage.getItem("token");
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
          <h2 style={{color: 'red'}}>New ER Visit</h2>
          <Button onClick={this.newVisit} type="danger">New Emergency Room Visit</Button>
          <h2>Pending ER Visits</h2>
          
          <Table columns={columns} dataSource={visits} rowKey={visits => visits.id} scroll={{ x: 800 }} />
          
          {/* <ul>
            {visits.map(visit => (
              <li key={visit.id}>
                {visit.id} {visit.visit_description} {visit.given_wait_time_minutes} {visit.created_at}
              </li>
            ))}
          </ul> */}

        </main>
      );
    }
  }
}

export default Caregiver;