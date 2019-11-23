
import React from 'react';
import 'antd/dist/antd.css';
import './index.css';
import { Form, Icon, Input, Button } from 'antd';
import axios from 'axios';
const querystring = require('querystring');

class HorizontalLoginForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      waitTime: "",
      triageComments: "",
      hideForm: false
    }
  }

  fetchData = () => {
    this.setState({
      waitTime: this.props.waitTime,
      triageComments: this.props.triageComments,
    });
  }

  componentDidMount() {
    this.setState({
      waitTime: this.props.waitTime,
      triageComments: this.props.triageComments,
    });
    // this.props.form.setFieldsValue({
    //   wait_time: this.props.waitTime,
    //   triageComments: this.props.triageComments,
    // })
  }

  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if (this.props.visitId !== prevProps.visitId) {
      this.fetchData();
      if(!this.props.waitTime) {
        this.setState({
          hideForm: false,
        });
      }
    }
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
            this.props.getVisits(); // force parent Admin.jsx to re-fetch ALL visits…lazy and inefficient I know
            this.setState({
              hideForm: true,
              waitTime: values.wait_time,
              triageComments: values.triage_comments
            });
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
    const { getFieldDecorator } = this.props.form;

    // Only show error after a field is touched.
    // const visit_time_error = isFieldTouched('wait_time') && getFieldError('wait_time');
    // const triage_comment_error = isFieldTouched('triage_comments') && getFieldError('triage_comments');
    // console.log("my wait tims is", this.props.waitTime);
    if (this.props.waitTime || this.state.hideForm) {
    return (<h2 className="red">A wait time of {this.state.waitTime} minutes has been assigned with comment "{this.state.triageComments}"</h2>);
    }
    else {
      return (
        <><h2 className="red">Assign a wait time (may only be submitted once)</h2>
          <Form layout="inline" onSubmit={this.assignWaitTime}>
            <Form.Item label="Assign wait time" key={this.props.visitId}>
              {getFieldDecorator('wait_time', {
                rules: [{ required: true, message: 'Please input the wait time!' }]
              })(
                <Input
                  prefix={<Icon type="clock-circle" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  size="large"
                  placeholder="Wait time (minutes)"
                />,
              )}
            </Form.Item>
            <Form.Item label="Comments to send">
              {getFieldDecorator('triage_comments', {
                rules: [{ required: true, message: 'Please input a comment!' }],
              })(
                <Input
                  prefix={<Icon type="file-text" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  size="large"
                  placeholder="Comments"
                />,
              )}
            </Form.Item>
            <Form.Item>
              <Button type="danger" htmlType="submit">
                Submit
          </Button>
            </Form.Item>
          </Form>
        </>
      );
    }
  }
}

const WrappedHorizontalLoginForm = Form.create({ name: 'horizontal_login' })(HorizontalLoginForm);

export default WrappedHorizontalLoginForm;
