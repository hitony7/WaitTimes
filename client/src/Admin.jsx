import React, { Component } from 'react';
import { Button, Table, Modal, Descriptions } from 'antd';
import { Redirect } from "react-router-dom";
// import $ from 'jquery';
import axios from 'axios';
import NOT_LOGGED_IN from './App.js';

class Admin extends Component {

  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
      message: 'Incoming ER visit requests are listed here. Please review cases, assess acuity, and assign an appropriate wait time.',
      error: null,
      isLoaded: false,
      visits: [],
      questions: [],
      visible: false,
      current_patient: {}
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
        for (const item of response.data) { // let's do some date updating and name combining
          item.event_date = this.props.formatDateFromUTCString(item.event_date);
          item.caregiver_name = item.caregiver_first_name + ' ' + item.caregiver_last_name;
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
    axios
      .get('/api/triage_questions', config) // let's grab the triage questions from the database
      .then(response => {
        // handle success
        for (const item of response.data) { // let's do some date updating and name combining
          item.answer = 'not yet implemented';
        }
        this.setState({
          isLoaded: true,
          questions: response.data,
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

  showModal = (record, e) => {
    this.setState({
      visible: true,
      current_patient: Object.assign({}, record)
    });
  };

  handleOk = e => {
    console.log(e);
    this.setState({
      visible: false,
      current_patient: {}
    });
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false,
      current_patient: {}
    });
  };

  render() {
    const { error, isLoaded, visits, questions } = this.state;
    const columns = [
      {
        title: 'Patient Name',
        dataIndex: 'patient_name'
      },
      {
        title: 'Age',
        dataIndex: 'patient_age',
        width: 100
      },
      {
        title: 'Caregiver Name',
        dataIndex: 'caregiver_name',
      },
      {
        title: 'Submission Date',
        dataIndex: 'event_date',
      },
      {
        title: 'Given Wait Time (minutes)',
        dataIndex: 'given_wait_time_minutes',
      },
      {
        title: 'Action',
        key: 'operation',
        fixed: 'right',
        width: 100,
        render: (record) => <Button type="primary" onClick={(e) => this.showModal(record, e)}>Details</Button>,
      }
    ];
    const modalColumns = [
      {
        title: 'Question No.',
        dataIndex: 'id'
      },
      {
        title: 'Question',
        dataIndex: 'question_text'
      },
      {
        title: 'Answer',
        dataIndex: 'answer'
      }
    ]
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
          <Modal
            title="Details"
            visible={this.state.visible}
            onOk={this.handleOk}
            width="700"
            onCancel={this.handleCancel}
          >
            <h2>New ER visit for {this.state.current_patient.patient_name} on {this.state.current_patient.event_date}</h2>
            <p>{this.state.current_patient.visit_description}</p>
            <Descriptions title="Patient Info">
              <Descriptions.Item label="Name">{this.state.current_patient.patient_name}</Descriptions.Item>
              <Descriptions.Item label="Age">{this.state.current_patient.patient_age}</Descriptions.Item>
              <Descriptions.Item label="AHC Number">{this.state.current_patient.patient_ahc_number}</Descriptions.Item>
              <Descriptions.Item label="Address">{this.state.current_patient.patient_address}</Descriptions.Item>
              <Descriptions.Item label="Gender">Update Me</Descriptions.Item>
              <Descriptions.Item label="Allergies">Update Me</Descriptions.Item>
            </Descriptions>
            <Descriptions title="Caregiver Info">
              <Descriptions.Item label="Name">{this.state.current_patient.caregiver_name}</Descriptions.Item>
              <Descriptions.Item label="Phone Number">{this.state.current_patient.phone}</Descriptions.Item>
              <Descriptions.Item label="Relationship">Update Me</Descriptions.Item>
            </Descriptions>
            <h2>Triage Question Answers</h2>
            <Table
              columns={modalColumns}
              dataSource={questions}
              rowKey={questions => questions.id}
            />
          </Modal>
          <Table
            columns={columns}
            dataSource={visits}
            rowKey={visits => visits.id}
            // scroll={{ x: 1200 }}
          // expandedRowRender={record => <p style={{ margin: 0 }}>{record.visit_description}</p>}
          />
        </main>
      );
    }
  }
}

export default Admin;