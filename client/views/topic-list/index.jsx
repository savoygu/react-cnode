import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import Tabs, { Tab } from 'material-ui/Tabs';

import AppState from '../../store/app-state';

@inject('appState') @observer
export default class TopicList extends Component {
  static propTypes = {
    appState: PropTypes.instanceOf(AppState).isRequired,
  }

  constructor(props, context) {
    super(props, context);
    this.changeTab = this.changeTab.bind(this);
    this.state = {
      tabIndex: 0,
    };
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

  changeTab(e, index) {
    this.setState({
      tabIndex: index,
    });
  }

  render() {
    const { tabIndex } = this.state;

    return (
      <div>
        <Helmet>
          <title>This is topic list</title>
          <meta name="description" content="This is topic list description" />
        </Helmet>
        <Tabs value={tabIndex} onChange={this.changeTab}>
          <Tab label="全部" />
          <Tab label="分享" />
          <Tab label="工作" />
          <Tab label="问答" />
          <Tab label="精品" />
          <Tab label="测试" />
        </Tabs>
      </div>
    );
  }
}
