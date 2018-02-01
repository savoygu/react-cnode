import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';

import Snackbar from 'material-ui/Snackbar';

@inject(stores => ({
  appState: stores.appState,
}))
@observer
class Notification extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      open: true,
    };
    this.handleClose = this.handleClose.bind(this);
  }

  handleClose() {
    this.props.appState.closeNotify(this.props.notify);
  }

  render() {
    const { notify } = this.props;
    const { open } = this.state;
    return (
      <Snackbar
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        message={notify.message}
        open={open}
        autoHideDuration={2000}
        onClose={this.handleClose}
      />
    );
  }
}

Notification.wrappedComponent.propTypes = {
  appState: PropTypes.object.isRequired,
};

Notification.propTypes = {
  notify: PropTypes.object.isRequired,
};

export default Notification;
