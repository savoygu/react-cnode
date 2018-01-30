import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Routes from '../config/router';

class App extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {};
  }

  render() {
    return [
      <div key="navs">
        <Link to="/">首页</Link>
        <br />
        <Link to="/detail">详情页</Link>
      </div>,
      <Routes key="routes" />,
    ];
  }
}

export default App;
