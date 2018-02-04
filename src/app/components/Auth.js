/* eslint-disable max-len */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'stent/lib/react';
import { NOT_AUTHORIZED } from '../stent/Auth';
import Login from './Login';

class Auth extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      text: false
    };
  }
  _textVisibility() {
    this.setState({ text: !this.state.text });
  }
  render() {
    const { status } = this.props;
    const { text } = this.state;

    if (status === NOT_AUTHORIZED) {
      return (
        <div className='auth'>
          { text ?
            <p><small>You are not logged in. That is fine but your notes will stay only on this device.<br />Click <a onClick={ () => this.props.login() }>here</a> to sign in.</small></p> :
            <a onClick={ () => this._textVisibility() } className='button'><i className='fa fa-warning'></i></a>
          }
        </div>
      );
    }

    return (
      <div className='auth'>

      </div>
    );
  }
}

Auth.propTypes = {
  status: PropTypes.string.isRequired,
  login: PropTypes.func.isRequired
};

export default connect(Auth)
  .with('Auth', 'Sidebar')
  .map(({ state }, sidebar) => ({
    status: state.name,
    login: () => sidebar.open(<Login />)
  }));
