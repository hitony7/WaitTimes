
import React from 'react';
import 'antd/dist/antd.css';
import './index.css';
import { Form, Icon, Input, Button } from 'antd';
import axios from 'axios';
const querystring = require('querystring');

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class HorizontalLoginForm extends React.Component {
  componentDidMount() {
    // To disabled submit button at the beginning.
    this.props.form.validateFields();
  }

  assignWaitTime = e => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const config = {
      headers: { 'Authorization': "Bearer " + token }
    };
    console.log("current visit id", this.props.visitId)
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const requestJSONobj = {
          "given_wait_time_minutes": values.wait_time,
          "triage_comment": values.triage_comments
        };
        axios.post('api/ervisit/' + this.props.visitId, querystring.stringify(requestJSONobj), config)
          .then((response) => {
            // console.log(response);
            // console.log('stuff')
            this.props.getVisits();
          })
          .catch((error) => {
            if (error.response) {
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
      }
    });
  };

  render() {
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;

    // Only show error after a field is touched.
    const visit_time_error = isFieldTouched('wait_time') && getFieldError('wait_time');
    const triage_comment_error = isFieldTouched('triage_comments') && getFieldError('triage_comments');
    return (
      <Form layout="inline" onSubmit={this.assignWaitTime}>
        <Form.Item validateStatus={visit_time_error ? 'error' : ''} help={visit_time_error || ''}>
          {getFieldDecorator('wait_time', {
            rules: [{ required: true, message: 'Please input the wait time!' }],
          })(
            <Input
              prefix={<Icon type="clock-circle" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Wait Time"
            />,
          )}
        </Form.Item>
        <Form.Item validateStatus={triage_comment_error ? 'error' : ''} help={triage_comment_error || ''}>
          {getFieldDecorator('triage_comments', {
            rules: [{ required: true, message: 'Please input a comment!' }],
          })(
            <Input
              prefix={<Icon type="file-text" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Comments"
            />,
          )}
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" disabled={hasErrors(getFieldsError())}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

const WrappedHorizontalLoginForm = Form.create({ name: 'horizontal_login' })(HorizontalLoginForm);

export default WrappedHorizontalLoginForm;
