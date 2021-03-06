import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';

import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import Typography from 'material-ui/Typography';
import HomeIcon from 'material-ui-icons/Home';

import Notification from '../../components/notification';

const styles = {
  root: {
    width: '100%',
  },
  flex: {
    flex: 1,
  },
};

@inject(stores => ({
  appState: stores.appState,
}))
@observer
class MainAppBar extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.onHomeIconClick = this.onHomeIconClick.bind(this);
    this.createButtonClick = this.createButtonClick.bind(this);
    this.loginButtonClick = this.loginButtonClick.bind(this);
  }

  onHomeIconClick() {
    this.context.router.history.push('/list?tab=all');
  }

  createButtonClick() {
    this.context.router.history.push('/topic/create');
  }

  loginButtonClick() {
    if (this.props.appState.user.isLogin) {
      this.context.router.history.push('/user/info');
    } else {
      this.context.router.history.push('/user/login');
    }
  }

  render() {
    const { classes } = this.props;
    const { user, activeNotifications } = this.props.appState;

    return (
      <div className={classes.root}>
        <AppBar position="fixed">
          <Toolbar>
            <IconButton onClick={this.onHomeIconClick}>
              <HomeIcon />
            </IconButton>
            <Typography type="title" color="inherit" className={classes.flex}>JNode</Typography>
            {
              user.isLogin ?
                <Button raised color="primary" onClick={this.createButtonClick}>新建话题</Button> :
                null
            }
            <Button onClick={this.loginButtonClick}><span>{user.isLogin ? `${user.info.loginname}` : '登录'}</span></Button>
          </Toolbar>
        </AppBar>
        {
          activeNotifications && activeNotifications.length > 0 ?
            activeNotifications.map(notify => <Notification key={notify.id} notify={notify} />) :
            null
        }
      </div>
    );
  }
}

MainAppBar.wrappedComponent.propTypes = {
  appState: PropTypes.object.isRequired,
};

MainAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MainAppBar);
