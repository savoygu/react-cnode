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
      <div>This is a simple app to rewrite.</div>,
      <div>
        <Link to="/">首页</Link>
        <Link to="/detail">详情页</Link>
      </div>,
      <Routes />,
    ];
  }
}

export default App;
