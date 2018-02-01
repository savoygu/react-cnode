import React from 'react';
import PropTypes from 'prop-types';
import {
  inject,
  observer,
} from 'mobx-react';
import {
  Redirect,
} from 'react-router-dom';
import queryString from 'query-string';

import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import { withStyles } from 'material-ui/styles';

import UserWrapper from './user';
import loginStyles from './styles/login-style';

@inject(stores => ({
  appState: stores.appState,
  user: stores.appState.user,
})) @observer
class UserLogin extends React.Component {
  static contextTypes = {
    router: PropTypes.object,
  }

  constructor() {
    super();
    this.state = {
      accesstoken: 'fe4dcb3a-c930-4267-adfa-53fbd16b5065',
      helpText: '',
    };
    this.handleLogin = this.handleLogin.bind(this);
    this.handleInput = this.handleInput.bind(this);
  }

  getFrom(location) {
    location = location || this.props.location;
    const query = queryString.parse(location.search);
    return query.from || '/user/info';
  }

  handleLogin() {
    // handle login here
    if (!this.state.accesstoken) {
      return this.setState({
        helpText: '必须填写',
      });
    }
    this.setState({
      helpText: '',
    });
    return this.props.appState.login(this.state.accesstoken)
      .catch((msg) => {
        this.props.appState.notify({ message: msg });
      });
  }

  handleInput(event) {
    this.setState({
      accesstoken: event.target.value.trim(),
    });
  }

  render() {
    const { classes, user } = this.props;
    const { isLogin } = user;
    const from = this.getFrom();
    if (isLogin) {
      return (
        <Redirect to={from} />
      );
    }

    return (
      <UserWrapper>
        <div className={classes.root}>
          <TextField
            label="请输入Cnode AccessToken"
            placeholder="请输入Cnode AccessToken"
            required
            helperText={this.state.helpText}
            value={this.state.accesstoken}
            onChange={this.handleInput}
            className={classes.input}
          />
          <Button
            raised
            color="primary"
            onClick={this.handleLogin}
            className={classes.loginButton}
          >
            登 录
          </Button>
        </div>
      </UserWrapper>
    );
  }
}

UserLogin.wrappedComponent.propTypes = {
  appState: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
};

UserLogin.propTypes = {
  classes: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
};

// export default withStyles(loginStyles)(inject(stores => ({
//   appState: stores.appState,
//   user: stores.appState.user,
// }))(observer(UserLogin)));
export default withStyles(loginStyles)(UserLogin);
