/* eslint-disable max-len */
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { connect } from 'stent/lib/react';
import { getIconClassName } from '../constants';

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
    const iconClass = getIconClassName(icon);

    return iconClass ? <i className={ `wi wi-${ iconClass }` }></i> : null;
  }
  _renderTemperature({ temperature, max }) {
    return (
      <span>
        { temperature }
        <span style={{ opacity: '0.4' }}>/{ max }</span>
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
  _renderWeather() {
    if (!this._isWeatherDataHere()) return null;

    const { data } = this.props;
    const { today } = this.state;

    return (
      <div className='weather'>
        <div className='days'>
          { data.days.map((day, i) => {
            if (i > 4) return null;
            const isItNow = today.time.isSame(day.time, 'day');

            return (
              <div key={ i } style={{ fontWeight: isItNow ? 'bold' : 'normal' }}>
                <span className='medium' style={{ paddingBottom: '0.4em', fontWeight: '100' }}>{ this._renderIcon(day) } { this._renderTemperature(day) }</span>
                <span>{ day.time.format('dddd, Do') }</span>
                <small className='small'>{ day.summary }</small>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  componentWillReceiveProps(newProps) {
    if (newProps.data) {
      this.setState({
        today: newProps.data.days.find(day => {
          return day.time.isSame(this.state.now, 'day');
        })
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
      <div className='clockForecast'>
        <span className='big'>{ this.state.now.format('HH:mm') }</span>
        { this._renderDay() }
        { this._renderWeather() }
        <div className='newTerminal'>
          <a onClick={ () => this.props.children() }>
            <img src='img/terminal.svg' width='100' height='100' />
          </a>
        </div>
        { this._isWeatherDataHere() &&
          <div className='geoLocation'>
            <span className='small'>{ `${ this.props.data.city }, ${ this.props.data.country }, ${ this.props.data.timezone }` }</span>
          </div>
        }
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
  .map(({ state, fetch }) => ({
    state: state.name,
    data: state.data,
    error: state.error,
    lastUpdated: state.lastUpdated,
    fetch
  }));
