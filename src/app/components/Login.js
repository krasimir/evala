/* eslint-disable max-len */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'stent/lib/react';

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      type: 'existing',
      sending: false,
      error: null,
      data: {
        username: '',
        password: '',
        email: ''
      }
    };

    this._onUsernameChange = e => this._onChange('username', e.target.value);
    this._onPasswordChange = e => this._onChange('password', e.target.value);
    this._onEmailChange = e => this._onChange('email', e.target.value);

  }
  _changeAccountType() {
    this.setState({ type: this.state.type === 'existing' ? 'new' : 'existing' });
  }
  _onChange(field, value) {
    this.setState({
      data: {
        ...this.state.data,
        [field]: value
      }
    });
  }
  _register() {
    this.setState({ sending: true, error: null }, () => {
      const { username, password, email } = this.state.data;

      if (username === '' || password === '' && email === '') {
        this.setState({ sending: false, error: true });
      } else {
        
      }
    });
  }
  _signIn() {
    this.setState({ sending: true, error: null }, () => {
      const { username, password } = this.state.data;

      if (username === '' || password === '') {
        this.setState({ sending: false, error: true });
      } else {

      }
    });
  }
  render() {
    const { type, data, sending, error } = this.state;
    const { username, password, email } = data;

    if (sending) {
      return (
        <div className='login'>
          <form>
            <i className='fa fa-hourglass-half'></i> Loading ...
          </form>
        </div>
      );
    }

    if (type === 'existing') {
      return (
        <div className='login'>
          <form>
            <input type='text' placeholder='username' value={ username } onChange={ this._onUsernameChange }/>
            <input type='password' placeholder='password' value={ password } onChange={ this._onPasswordChange }/>
            { error && <div><small>Please fill in all the fields.</small></div> }
            <a className='button buttonBordered' onClick={ () => this._signIn() }><i className='fa fa-sign-in'></i> Sign in</a>
            <br /><br />
            <small>You don&apos;t have an account? Click <a onClick={ () => this._changeAccountType() }>here</a> to get one.</small>
          </form>
        </div>
      );
    }

    return (
      <div className='login'>
        <form>
          <input type='text' placeholder='username' value={ username } onChange={ this._onUsernameChange }/>
          <input type='password' placeholder='password' value={ password } onChange={ this._onPasswordChange }/>
          <input type='email' placeholder='email' value={ email } onChange={ this._onEmailChange }/>
          { error && <div><small>Please fill in all the fields.</small></div> }
          <a className='button buttonBordered' onClick={ () => this._register() }><i className='fa fa-user-plus'></i> Register</a>
          <br /><br />
          <small>You already have an account? Click <a onClick={ () => this._changeAccountType() }>here</a> to sign in.</small>
        </form>
      </div>
    );
  }
}

Login.propTypes = {
  status: PropTypes.string.isRequired
};

export default connect(Login)
  .with('Auth', 'Sidebar')
  .map(({ state }, sidebar) => ({
    status: state.name,
    login: () => sidebar.open(<Login />)
  }));
