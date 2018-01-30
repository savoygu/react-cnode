import React, { Component } from 'react';
import axios from 'axios';
import cnode from '../../../cnode.json';

/* eslint-disable */
export default class TestApi extends Component {
  getTopics() {
    axios.get('/api/topics')
      .then((res) => {
        console.log(res);
      });
  }

  login() {
    axios.post('/api/user/login', {
      accessToken: cnode.accessToken
    }).then(res => {
      console.log(res);
    })
  }

  markAll() {
    axios.post('/api/message/mark_all?needAccessToken=true')
      .then(res => {
        console.log(res);
      })
  }

  render() {
    return (
      <div>
        <button onClick={this.getTopics}>topics</button>
        <button onClick={this.login}>login</button>
        <button onClick={this.markAll}>markAll</button>
      </div>
    );
  }
}
/* eslint-enable */
