import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import AppState from '../../store/app-state';

@inject('appState') @observer
export default class TopicList extends Component {
  static propTypes = {
    appState: PropTypes.instanceOf(AppState).isRequired,
  }

  constructor(props, context) {
    super(props, context);
    this.changeName = this.changeName.bind(this);
    this.state = {};
  }

  asyncBootstrap() {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.props.appState.count = 3;
        resolve(true);
      }, 2000);
    });
  }

  changeName(event) {
    this.props.appState.changeName(event.target.value);
  }

  render() {
    return (
      <div>
        <Helmet>
          <title>This is topic list</title>
          <meta name="description" content="This is topic list description" />
        </Helmet>
        <input type="text" onChange={this.changeName} />
        <span>{this.props.appState.msg}</span>
      </div>
    );
  }
}
