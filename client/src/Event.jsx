

import React, { Component } from 'react';
import { Form, Input, Button, Alert, List } from 'antd';
import { Redirect } from "react-router-dom";
import axios from 'axios';
import NOT_LOGGED_IN from './App.js';
const querystring = require('querystring');
const { TextArea } = Input;


class Event extends Component {

  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
      message: 'Please provide some details for your upcoming ER visit. All fields are required.',
      serverResponse: '',
      serverResponseErrors: null,
      triageQuestionsError: null,
      triageQuestionsAreLoaded: false,
      triageQuestions: [],
      triageQuestionAnswers: []
    };
  }

  cancel = e => {
    e.preventDefault();
    this.setState({ redirect: true });
  }

  componentDidMount() {
    const token = localStorage.getItem("token");
    const config = {
      headers: { 'Authorization': "Bearer " + token }
    };
    axios
      .get('/api/triage_questions', config) // let's grab the triage questions from the database
      .then(response => {
        // handle success
        // console.log(response.data.message); // Just the message
        const numOfTriageQuestions = response.data.length;
        let emptyAnswers = [];
        for (let i = 1; i <= numOfTriageQuestions; i++) { // now let's create the empty answers object
          emptyAnswers.push({ answer_text: '', triage_questions_id: i, emergency_room_visits_id: 0 });
        }
        this.setState({
          triageQuestionsAreLoaded: true,
          triageQuestions: response.data,
          triageQuestionAnswers: emptyAnswers
        });
      },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          this.setState({
            triageQuestionsAreLoaded: true,
            triageQuestionsError: error
          });
        });
  }


  // componentDidUpdate() {
  //   if (this.state.redirect) {
  //     this.setState({ redirect: false })
  //   }
  // }

  // getTriageQuestions = () => {
  //   const token = localStorage.getItem("token");
  //   const config = {
  //     headers: { 'Authorization': "Bearer " + token }
  //   };
  //   // console.log(config);
  //   axios
  //     .get('/api/triage_questions', config) // You can simply make your requests to "/api/whatever you want"
  //     .then(response => {
  //       // handle success
  //       // console.log(response.data); // The entire response from the Rails API
  //       // console.log(response.data.message); // Just the message
  //       this.setState({
  //         triageQuestions: response.data
  //       });
  //     });
  // };

  handleTriageQuestionAnswerChange = idx => evt => {
    const newAnswer = this.state.triageQuestionAnswers.map((answer, aidx) => {
      if (idx - 1 !== aidx) return answer; // indices in PostgreSQL start at 1 not 0
      return { ...answer, answer_text: evt.target.value }
    });
    // console.log('I\'m getting run'); // runs each time text is modified in a box
    this.setState({ triageQuestionAnswers: newAnswer });
  }

  startEmergencyEvent = e => {
    e.preventDefault();
    this.setState({ serverResponse: '' }); // clear before submitting if alerts already displayed
    this.setState({ serverResponseErrors: null }); // clear before submitting if alerts already displayed
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const requestJSONobj = {
          "visit_description": values.visit_description,
          "emergency_rooms_id": 2,
          "patients_id": this.props.patient_id
        };
        const token = localStorage.getItem("token");
        const config = {
          headers: { 'Authorization': "Bearer " + token }
        };
        axios.post('api/event', querystring.stringify(requestJSONobj), config)
          .then((response) => {
            this.setState({ serverResponse: 'Submitting info…' });
            const erVisitId = response.data.id;
            this.props.setVisitId(erVisitId);
            let answersToSend = this.state.triageQuestionAnswers;
            answersToSend.forEach(ans => {
              ans.emergency_room_visits_id = erVisitId;
            });
            let formData = new FormData();
            formData.append("items", escape(JSON.stringify(answersToSend)));
            return axios.post('api/triage_question_answers', formData, config)
            .then((response) => {
              this.setState({ serverResponse: 'Submitting info…' });
              // console.log(response);
              setTimeout(function () { //Start the timer
                this.setState({ redirect: true }) //After 1 second, set redirect to true
              }.bind(this), 1000);
            })
            .catch((error) => {
              if (error.response) {
                this.setState({ serverResponseErrors: error.response.data.errors });
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log(error.response.data);
                console.log(error.response.status);
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
          })
          .catch((error) => {
            if (error.response) {
              this.setState({ serverResponseErrors: error.response.data.errors });
              // The request was made and the server responded with a status code
              // that falls out of the range of 2xx
              console.log('error response data', error.response.data.errors);
              console.log(error.response.data);
              console.log(error.response.status);
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

  render() {
    const { getFieldDecorator } = this.props.form;
    const { triageQuestionsError, triageQuestionsAreLoaded, triageQuestions } = this.state;
    if (this.state.redirect) {
      return (<Redirect to='/caregiver' />)
    }
    if (this.state.loggedInStatus === NOT_LOGGED_IN) {
      return (<Redirect to='/' />)
    }
    if (triageQuestionsError) {
      return <div>Error: {triageQuestionsError.message}</div>
    }
    else if (!triageQuestionsAreLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <div className="sign-in">
          <h1>New ER Visit for {this.props.patient_name}</h1>
          <h2>{this.state.message}</h2>

          <Form onSubmit={this.startEmergencyEvent} className="registration-form" layout="horizontal">
          <Form.Item label="What is your main concern? Why do you want to bring your child in to be seen by an emergency physician?">
              {getFieldDecorator('visit_description', {
                rules: [{ required: false, message: 'Please input your answer!' }],
              })(
                <TextArea
                  rows={3}
                  name="visit_description"
                  id="visit_description"
                  type="text"
                  required
                />
              )}
            </Form.Item>

            {triageQuestions.map((question, idx) => (
              <Form.Item label={question.question_text} key={idx}>
                <TextArea
                  rows={3}
                  name={question.id}
                  id={question.id}
                  type="text"
                  required
                  onChange={this.handleTriageQuestionAnswerChange(question.id)}
                />
              </Form.Item>
            ))}

            <Form.Item>
              <Button htmlType="submit">
                Submit
          </Button>
            </Form.Item>
            {this.state.serverResponse && <Alert
              message="Event Initiation Succesful"
              description={this.state.serverResponse}
              type="success"
              showIcon
            />}
            {this.state.serverResponseErrors && <List
              header={<h2>Error!</h2>}
              bordered
              dataSource={this.state.serverResponseErrors}
              renderItem={item => <List.Item>{item}</List.Item>}
            />}
          </Form>
          <Button onClick={this.cancel}>Cancel</Button>
        </div>
      );
    }
  }
}

const EventForm = Form.create({ name: 'patient' })(Event);

export default EventForm;