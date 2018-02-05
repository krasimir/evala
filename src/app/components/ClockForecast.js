/* eslint-disable max-len */
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { connect } from 'stent/lib/react';
import { ICONS_MAPPING } from '../constants';

const CLOCK_HOURS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];

class ClockForecast extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      now: moment(),
      today: null,
      timelineMode: 'hours'
    };
    this._changeTimelineMode = this._changeTimelineMode.bind(this);
    this._interval = setInterval(() => {
      this.setState({ now: moment() });
    }, 60000);
  }
  _changeTimelineMode() {
    this.setState({ timelineMode: this.state.timelineMode === 'hours' ? 'days' : 'hours' });
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
  _renderWeatherItem(item, firstRow = 'time') {
    const { time, summary } = item;

    return (
      <div className='weatherItem'>
        { firstRow === 'time' ? time.format('HH:mm') : time.format('dddd, MMMM Do') }<br />
        { this._renderIcon(item) }
        { this._renderTemperature(item) }<br />
        <span className='small'>{ summary }</span>
      </div>
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
  _renderWeatherTimelineByHours() {
    if (!this.props.data) return null;

    const { data } = this.props;

    const weather = data.hours.reduce((result, hourWeather) => {
      result[hourWeather.time.hour()] = hourWeather;
      return result;
    }, {});
    const currentHour = this.state.now.hour();
    const progressWidth = ((currentHour + (this.state.now.minutes() / 60)) / 24) * 100;

    return (
      <div className='weatherTimeline'>
        <div className='line'><div className='progress' style={{ width: `${ progressWidth }%` }}></div></div>
        <ul>
          { CLOCK_HOURS.map((hour, i) => {
            return (
              <li
                key={ i }
                onClick={ this._changeTimelineMode }
                style={{
                  left: `${ (i / 24) * 100 }%`,
                  width: `${ Math.floor(100 / 23) }%`
                }}>
                { this._renderWeatherItem(weather[hour]) }
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
  _renderWeatherTimelineByDays() {
    if (!this.props.data) return null;

    const { data } = this.props;
    const progressWidth = 0;

    return (
      <div className='weatherTimeline'>
        <div className='line'><div className='progress' style={{ width: `${ progressWidth }%` }}></div></div>
        <ul>
          { data.days.map((day, i) => {
            return (
              <li
                key={ i }
                onClick={ this._changeTimelineMode }
                style={{
                  left: `${ (i / data.days.length) * 100 }%`,
                  width: `${ Math.floor(100 / data.days.length) }%`
                }}>
                { this._renderWeatherItem(day, 'date') }
              </li>
            );
          })}
        </ul>
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
        { this.state.timelineMode === 'hours' ?
          this._renderWeatherTimelineByHours() :
          this._renderWeatherTimelineByDays() }
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
  lastUpdated: PropTypes.any
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
