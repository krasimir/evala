// https://codepen.io/addyosmani/pen/avxmvN
import { connect } from 'stent/lib/react';
import React from 'react';
import PropTypes from 'prop-types';
import { ICONS_MAPPING } from '../constants';
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
          <SplitGrid content={ options => <ReactTerminal options={ options }/> } />
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
        <span className='separator'></span>
        { this._renderWeatherNow() }
        <span className='separator'></span>
        <small>
          <a onClick={ () => this._renderWeather() }>
            <i className='fa fa-thermometer-half'></i>
          </a>
        </small>
      </span>
    );
  }
  _isWeatherDataHere() {
    return this.props.data && this.state.today;
  }
  _renderWeatherNow() {
    if (!this._isWeatherDataHere()) return null;

    const { data } = this.props;
    const { today } = this.state;

    return (
      <span>
        { this._renderIcon(today) }
        <span className='separator'></span>
        { this._renderTemperature(today) }
        <span className='separator'></span>
        { today.summary }
        <span className='separator'></span>
        <small>({ data.timezone })</small>
      </span>
    );
  }
  // _renderWeather() {
  //   this._renderWeatherDay();
  //   this._renderWeatherWeek();
  // }
  // _renderWeatherDay() {
  //   if (!this.props.data) return;
  //   if (!this.term) return;

  //   const { data } = this.props;

  //   this.term.writeln(data.hours.reduce((result, { time, temperature, apparentTemperature, summary }) => {
  //     result += '\n\r';
  //     result += time.format('HH:mm') + ' ';
  //     result += temperature + '°C/' + apparentTemperature + '°C ';
  //     result += time.format('Do dddd') + ' / ';
  //     result += summary;
  //     if (time.isSame(this.state.now, 'hour')) {
  //       result += ' <---';
  //     }
  //     return result;
  //   }, ''));
  //   this.term.focus();
  // }
  // _renderWeatherWeek() {
  //   if (!this.props.data) return;
  //   if (!this.term) return;

  //   const { data } = this.props;

  //   this.term.writeln(data.days.reduce((result, { time, temperature, apparentTemperature, summary }) => {
  //     result += '\n\r';
  //     result += time.format('HH:mm') + ' ';
  //     result += temperature + '°C/' + apparentTemperature + '°C ';
  //     result += time.format('Do dddd') + ' / ';
  //     result += summary + ' ';
  //     if (time.isSame(this.state.now, 'day')) {
  //       result += ' <---';
  //     }
  //     return result;
  //   }, ''));
  //   this.term.focus();
  // }
  _renderIcon({ icon }) {
    var isItDay = true;
    const { sunrise, sunset } = this.state.today;
    const { now } = this.state;

    if (sunset && sunrise) {
      isItDay = now.isAfter(sunrise) && now.isBefore(sunset);
    }

    const iconClass = ICONS_MAPPING[icon][isItDay ? 0 : 1];

    return iconClass ? <i className={ `wi ${ iconClass }` }></i> : null;
  }
  _renderTemperature({ temperature, apparentTemperature }) {
    return (
      <span>
        { temperature }<sup style={{ fontSize: '0.5em' }}>&#8451;</sup><span style={{ opacity: 0.4} }>/{ apparentTemperature }<sup style={{ fontSize: '0.5em' }}>&#8451;</sup></span>
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

export default connect(TerminalWindow)
  .with('Weather')
  .map(({ state, fetch, refreshData }) => ({
    state: state.name,
    data: state.data,
    error: state.error,
    lastUpdated: state.lastUpdated
  }));
