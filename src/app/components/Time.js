/* eslint-disable max-len */
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { connect } from 'stent/lib/react';
import { ICONS_MAPPING } from '../constants';

const CLOCK_SIZE = 200;
const CLOCK_HOURS = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];

function toRadians(degrees) {
  return degrees * Math.PI / 180;
};
function getClockItemStylse(hour) {
  const deg = ((hour / CLOCK_HOURS.length) * 360) - 90;
  const left = (Math.cos(toRadians(deg)) * CLOCK_SIZE);
  const top = (Math.sin(toRadians(deg)) * CLOCK_SIZE);

  return {
    left: `${ left }px`,
    top: `${ top }px`
  };
}
const CLOCK_STYLES = CLOCK_HOURS.map((hour, i) => getClockItemStylse(i));

class Time extends React.Component {
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
  _renderWeatherItem(item) {
    var isItDay = true;
    const { sunrise, sunset } = this.state.today;
    const { now } = this.state;
    const { time, temperature, apparentTemperature, icon } = item;

    if (sunset && sunrise) {
      isItDay = now.isAfter(sunrise) && now.isBefore(sunset);
    }

    const iconClass = ICONS_MAPPING[icon][isItDay ? 0 : 1];

    return (
      <div className='weatherItem'>
        { time.format('HH:mm') }
        { iconClass && <i className={ `wi ${ iconClass }` }></i> }
        { temperature }<sup style={{ fontSize: '0.5em' }}>&#8451;</sup>
        <span style={{ opacity: 0.4} }>/{ apparentTemperature }<sup style={{ fontSize: '0.5em' }}>&#8451;</sup></span>
      </div>
    );
  }
  _renderWeatherClock() {
    if (!this.props.data) return null;

    const weather = this.props.data.hours.reduce((result, hourWeather) => {
      result[hourWeather.time.format('HH')] = hourWeather;
      return result;
    }, {});

    return (
      <ul className='clock'>
        { CLOCK_HOURS.map((hour, i) => {
          return (
            <li
              key={ i }
              style={ CLOCK_STYLES[i] }>
              <div className='dot' />
              { this._renderWeatherItem(weather[hour]) }
            </li>
          );
        })}
      </ul>
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
      <div className='time'>
        { this._renderWeatherClock() }
        <span className='big'>{ this.state.now.format('HH:mm') }</span>
        <span className='medium'>{ this.state.now.format('MMMM Do YYYY') }</span>
        <span className='small'>Happy { this.state.now.format('dddd') }!</span>
      </div>
    );
  }
};

Time.propTypes = {
  state: PropTypes.string,
  fetch: PropTypes.func,
  openSidebar: PropTypes.func,
  error: PropTypes.any,
  data: PropTypes.any,
  lastUpdated: PropTypes.any
};

export default connect(Time)
  .with('Weather', 'Sidebar')
  .map(({ state, fetch, refreshData }, sidebar) => ({
    state: state.name,
    data: state.data,
    error: state.error,
    lastUpdated: state.lastUpdated,
    fetch,
    openSidebar: content => sidebar.open(content)
  }));
