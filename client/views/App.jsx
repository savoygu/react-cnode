import React, { Component } from 'react';
// import { Link } from 'react-router-dom';
import Routes from '../config/router';
import AppBar from './layout/app-bar';

class App extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {};
  }

  render() {
    return [
      <AppBar key="appbar" />,
      <Routes key="routes" />,
    ];
  }
}

export default App;
