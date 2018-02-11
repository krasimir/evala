/* eslint-disable max-len */
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { connect } from 'stent/lib/react';
import { ICONS_MAPPING } from '../constants';

class ClockForecast extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      now: moment(),
      today: null
    };
    this._interval = setInterval(() => {
      this.setState({ now: moment() });
    }, 60000);
  }
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
  _renderDay() {
    return (
      <div className='day'>
        <span className='medium'>{ this.state.now.format('MMMM Do YYYY') }</span>
        <span className='small'>Happy { this.state.now.format('dddd') }!</span>
      </div>
    );
  }
  _isWeatherDataHere() {
    return this.props.data && this.state.today;
  }
  _renderTodayWeather() {
    if (!this._isWeatherDataHere()) return null;

    const { data } = this.props;
    const { today } = this.state;

    return (
      <div className='weather'>
        { this._renderIcon(today) }
        { this._renderTemperature(today) } <small>{ today.summary }</small>
        <span className='small'>{ data.timezone }</span>
      </div>
    );
  }
  componentWillReceiveProps(newProps) {
    if (newProps.data) {
      this.setState({
        today: newProps.data.days.find(day => day.time.isSame(this.state.now, 'day'))
      });
    }
  }
  componentWillUnmount() {
    clearInterval(this._interval);
  }
  componentDidMount() {
    this.props.fetch();
  }
  render() {
    return (
      <div className={ `clockForecast ${ !this._isWeatherDataHere() ? 'noWeatherData' : '' }` }>
        <span className='big'>{ this.state.now.format('HH:mm') }</span>
        { this._renderDay() }
        { this._renderTodayWeather() }
        <div className='newTerminal'>
          <a onClick={ () => this.props.children() }>
            <img src='img/terminal.svg' width='100' height='100' />
          </a>
        </div>
      </div>
    );
  }
};

ClockForecast.propTypes = {
  state: PropTypes.string,
  fetch: PropTypes.func,
  openSidebar: PropTypes.func,
  error: PropTypes.any,
  data: PropTypes.any,
  lastUpdated: PropTypes.any,
  children: PropTypes.func
};

export default connect(ClockForecast)
  .with('Weather')
  .map(({ state, fetch, refreshData }) => ({
    state: state.name,
    data: state.data,
    error: state.error,
    lastUpdated: state.lastUpdated,
    fetch
  }));
