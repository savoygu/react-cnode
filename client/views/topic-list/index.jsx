import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';

import queryString from 'query-string';

import Tabs, { Tab } from 'material-ui/Tabs';
import List from 'material-ui/List';
import { CircularProgress } from 'material-ui/Progress';

import { AppState, TopicStore } from '../../store/store';
import Container from '../layout/container';
import TopicListItem from './list-item';
import { tabs } from '../util/variable-define';

@inject(stores => ({
  appState: stores.appState,
  topicStore: stores.topicStore,
}))
@observer
export default class TopicList extends Component {
  static contextTypes = {
    router: PropTypes.object,
  }

  constructor(props, context) {
    super(props, context);
    this.changeTab = this.changeTab.bind(this);
    this.listItemClick = this.listItemClick.bind(this);
  }

  componentDidMount() {
    const tab = this.getTab();
    this.props.topicStore.fetchTopics(tab);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location.search !== this.props.location.search) {
      this.props.topicStore.fetchTopics(this.getTab(nextProps.location.search));
    }
  }

  getTab(tabSearch) {
    const search = tabSearch || this.props.location.search;
    const query = queryString.parse(search);
    return query.tab || 'all';
  }

  changeTab(e, value) {
    this.context.router.history.push({
      pathname: '/list',
      search: `?tab=${value}`,
    });
  }

  listItemClick(topic) {
    this.context.router.history.push(`/detail/${topic.id}`);
  }

  asyncBootstrap() {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.props.appState.count = 3;
        resolve(true);
      }, 2000);
    });
  }

  render() {
    const { topicStore } = this.props;
    const { topics, syncing } = topicStore;
    const tabValue = this.getTab();

    return (
      <Container>
        <Helmet>
          <title>话题列表</title>
          <meta name="description" content="This is topic list description" />
        </Helmet>
        <Tabs value={tabValue} onChange={this.changeTab}>
          {
            Object.keys(tabs).map(tab => <Tab key={tab} label={tabs[tab]} value={tab} />)
          }
        </Tabs>
        {
          syncing ?
            (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
                <CircularProgress size={100} />
              </div>
            ) :
            (
              <List>
                {
                  topics.map(topic => (
                    <TopicListItem
                      key={topic.id}
                      onClick={() => this.listItemClick(topic)}
                      topic={topic}
                    />
                  ))
                }
              </List>
            )
        }
      </Container>
    );
  }
}

TopicList.wrappedComponent.propTypes = {
  appState: PropTypes.instanceOf(AppState).isRequired,
  topicStore: PropTypes.instanceOf(TopicStore).isRequired,
};

TopicList.propTypes = {
  location: PropTypes.object.isRequired,
};
