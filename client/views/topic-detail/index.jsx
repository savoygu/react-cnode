import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { observer, inject } from 'mobx-react';
import Helmet from 'react-helmet';
import marked from 'marked';
import dateformat from 'dateformat';

import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import { CircularProgress } from 'material-ui/Progress';
import Button from 'material-ui/Button';
import IconReply from 'material-ui-icons/Reply';

import { TopicStore } from '../../store/store';
import Container from '../layout/container';
import { topicDetailStyle } from './styles';
import Reply from './reply';

import SimpleMDE from '../../components/simple-mde';

@inject(stores => ({
  topicStore: stores.topicStore,
  user: stores.appState.user,
}))
@observer
class TopicDetail extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }

  constructor(props, context) {
    super(props, context);
    this.state = {
      newReply: '',
    };
    this.handleNewReplyChange = this.handleNewReplyChange.bind(this);
    this.goToLogin = this.goToLogin.bind(this);
    this.doReply = this.doReply.bind(this);
  }

  componentDidMount() {
    const id = this.getTopicId();
    this.props.topicStore.getTopicDetail(id);
  }

  getTopicId() {
    return this.props.match.params.id;
  }

  goToLogin() {
    this.context.router.history.push('/user/login');
  }

  handleNewReplyChange(value) {
    this.setState({
      newReply: value,
    });
  }

  doReply() {
    const { topicStore } = this.props;
    const id = this.getTopicId();
    const topic = topicStore.detailMap[id];
    topic.doReply(this.state.newReply)
      .then(() => {
        this.setState({
          newReply: '',
        });
      }).catch((err) => {
        console.log(err); // eslint-disable-line
      });
  }

  render() {
    const {
      classes, user, match, topicStore,
    } = this.props;
    const { id } = match.params;
    const topic = topicStore.detailMap[id];
    if (!topic) {
      return (
        <Container>
          <section className={classes.loadingContainer}>
            <CircularProgress />
          </section>
        </Container>
      );
    }
    return (
      <div>
        <Container>
          <Helmet>
            <title>{topic.title}</title>
          </Helmet>
          <header className={classes.header}>
            <h3>{topic.title}</h3>
          </header>
          <section className={classes.body}>
            <p dangerouslySetInnerHTML={{ __html: marked(topic.content) }} />
          </section>
        </Container>
        {
          topic.createdReplies && topic.createdReplies.length > 0 ?
            <Paper elevation={4} className={classes.replies} >
              <header className={classes.replyHeader}>
                <span>我的最新回复</span>
                <span>{`${topic.createdReplies.length} 条`}</span>
              </header>
              {
                topic.createdReplies.map(reply => (
                  <Reply
                    reply={
                      Object.assign({}, reply, {
                        author: {
                          avatar_url: user.info.avatar_url,
                          loginname: user.info.loginname,
                        },
                      })
                    }
                    key={reply.id}
                  />
                ))
              }
            </Paper> :
            null
        }
        <Paper elevation={4} className={classes.replies}>
          <header className={classes.replyHeader}>
            <span>{`${topic.reply_count} 回复`}</span>
            <span>{`最新回复 ${dateformat(topic.last_reply_at, 'yyyy-mm-dd')}`}</span>
          </header>
          {
            user.isLogin ?
              <section className={classes.replyEditor}>
                <SimpleMDE
                  onChange={this.handleNewReplyChange}
                  value={this.state.newReply}
                  options={{
                    toolbar: false,
                    autoFocus: false,
                    spellChecker: false,
                    placeholder: '添加你的精彩回复',
                  }}
                />
                <Button
                  fab
                  color="primary"
                  onClick={this.doReply}
                  className={classes.replyButton}
                >
                  <IconReply />
                </Button>
              </section> :
              <section className={classes.notLoginButton}>
                <Button raised="true" color="secondary" onClick={this.goToLogin}>登录并回复</Button>
              </section>
          }
          <section>
            {
              topic.replies.map(reply => <Reply reply={reply} key={reply.id} />)
            }
          </section>
        </Paper>
      </div>
    );
  }
}

TopicDetail.wrappedComponent.propTypes = {
  topicStore: PropTypes.instanceOf(TopicStore).isRequired,
  user: PropTypes.object.isRequired,
};

TopicDetail.propTypes = {
  classes: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

export default withStyles(topicDetailStyle)(TopicDetail);
