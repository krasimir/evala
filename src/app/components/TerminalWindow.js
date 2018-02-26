/* eslint-disable max-len */

// https://codepen.io/addyosmani/pen/avxmvN
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import ReactTerminal from './ReactTerminal';
import SplitGrid from './SplitGrid';

class TerminalWindow extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      now: moment(),
      today: null,
      maximized: false
    };
    this._interval = setInterval(() => {
      this.setState({ now: moment() });
    }, 60000);
  }
  componentWillReceiveProps(newProps) {
    if (newProps.data) {
      this._setToday(newProps.data);
    }
  }
  componentDidMount() {
    this.props.data && this._setToday(this.props.data);
  }
  componentWillUnmount() {
    clearInterval(this._interval);
  }
  render() {
    return (
      <div className={ `terminalWindow ${ this.state.maximized ? ' maximized' : '' }` }>
        <div className='fakeMenu'>
          <a className='fakeButtons fakeClose' onClick={ () => this.props.children('close') }></a>
          <a className='fakeButtons fakeZoom' onClick={ () => this._maximize() }></a>
          {/* <div className='fakeButtons fakeMinimize'></div> */}
          <span>{ this._renderWindowTitle() }</span>
        </div>
        <div className='fakeScreen'>
          <SplitGrid content={ ReactTerminal } />
        </div>
      </div>
    );
  }
  _maximize() {
    this.setState({ maximized: true });
    // setTimeout(() => {
    //   this.term.fit();
    //   this.term.focus();
    // }, 200);
  }
  _setToday(data) {
    this.setState({
      today: data.days.find(day => day.time.isSame(this.state.now, 'day'))
    });
  }
  _renderWindowTitle() {
    return (
      <span>
        { this.state.now.format('HH:mm') }
        <span className='separator'></span>
        <small>{ this.state.now.format('dddd, MMMM Do') }</small>
      </span>
    );
  }
}

TerminalWindow.propTypes = {
  state: PropTypes.string,
  fetch: PropTypes.func,
  openSidebar: PropTypes.func,
  error: PropTypes.any,
  data: PropTypes.any,
  lastUpdated: PropTypes.any,
  children: PropTypes.func
};

export default TerminalWindow;
