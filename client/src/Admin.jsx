import React, { Component } from 'react';
import { Table } from 'antd';
import { Redirect } from "react-router-dom";
// import $ from 'jquery';
import axios from 'axios';
import NOT_LOGGED_IN from './App.js';

class Admin extends Component {

  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
      message: 'Welcome to the triage admin panel. Here are all the incoming ER visit requests that we can assess and assign wait times to.',
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
      .get('/api/events', config) // let's grab the triage questions from the database
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


  render() {
    const { error, isLoaded, visits } = this.state;
    const columns = [
      {
        title: 'Patient Name',
        dataIndex: 'patient_name'
      },
      {
        title: 'Age',
        dataIndex: 'patient_age',
      },
      {
        title: 'Caregiver First Name',
        dataIndex: 'caregiver_first_name',
      },
      {
        title: 'Caregiver First Name',
        dataIndex: 'caregiver_first_name',
      },
      {
        title: 'Phone Number',
        dataIndex: 'phone',
      },
      {
        title: 'Address',
        dataIndex: 'patient_address',
      },
      {
        title: 'Patient AHC Number',
        dataIndex: 'patient_ahc_number',
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
    // const { getFieldDecorator } = this.props.form;
    if (this.state.redirect) {
      return (<Redirect to='/admin' />)
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
          <h1>Triage Admin Panel</h1>
          <p>{this.state.message}</p>
          <h2>Pending ER Visits</h2>
          <Table columns={columns} dataSource={visits} rowKey={visits => visits.id} scroll={{ x: 1200 }} />
        </main>
      );
    }
  }
}

export default Admin;