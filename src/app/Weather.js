import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'stent/lib/react';
import moment from 'moment';

// https://erikflowers.github.io/weather-icons/
const ICONS_MAPPING = {
  'clear-day': 'wi-day-sunny',
  'clear-night': 'wi-night-clear',
  'partly-cloudy-day': 'wi-day-cloudy',
  'partly-cloudy-night': 'wi-night-alt-cloudy',
  'cloudy': 'wi-cloudy',
  'rain': 'wi-rain',
  'sleet': 'wi-sleet',
  'snow': 'wi-snow',
  'wind': 'wi-windy',
  'fog': 'wi-fog'
};

class Weather extends React.Component {
  constructor(props) {
    super(props);

    this.now = moment();
    this._displayDays = this._displayDays.bind(this);
    this._displayHours = this._displayHours.bind(this);
    this.state = {
      display: null
    };
  }
  componentDidMount() {
    this.props.fetch();
  }
  _displayDays() {
    this.setState({ display: this.state.display === 'days' ? null : 'days' });
  }
  _displayHours() {
    this.setState({ display: this.state.display === 'hours' ? null : 'hours' });
  }
  _renderItem({ temperature, apparentTemperature, icon }) {
    const iconClass = ICONS_MAPPING[icon];

    return (
      <span>
        { iconClass && <i className={ `weatherIcon wi ${ iconClass }` }></i> }
        { temperature }<sup style={{ fontSize: '0.5em' }}>&#8451;</sup>
        <span style={{ opacity: 0.4} }>/{ apparentTemperature }<sup style={{ fontSize: '0.5em' }}>&#8451;</sup></span>
      </span>
    );
  }
  _renderDays() {
    const { data } = this.props;

    return data.days
      .filter(item => item.time.isAfter(this.now, 'day'))
      .map((item, i) => {
        return (
          <div key={ i } className='small tal'>
            { item.time.format('ddd (Do)') } <strong>{ this._renderItem(item) }</strong> { item.summary }
          </div>
        );
      });
  }
  _renderHours() {
    const { data } = this.props;

    return (
      <div>
        { data.hours
          .filter(item => item.time.isAfter(this.now, 'hour'))
          .map((item, i) => {
            return (
              <div key={ i } className='small tal'>
                { item.time.format('Do HH:mm') } <strong>{ this._renderItem(item) }</strong> { item.summary }
              </div>
            );
          })
        }
      </div>
    );
  }
  render() {
    const { state, data, lastUpdated, error } = this.props;

    if (state === 'no-data' || state === 'fetching') {
      return <div className='weather'>...</div>;
    }
    if (state === 'error') {
      console.error(error);
      return <div className='weather'>Error getting<br />the weather information.</div>;
    }

    const today = data.days.find(day => day.time.isSame(this.now, 'day'));

    if (today) {
      return (
        <div className='weather'>
          <span className='big'>
            { this._renderItem(today) }
          </span>
          <span className='medium'>{ today.summary }</span>
          <span className='small'>{ lastUpdated.format('MMMM Do YYYY, HH:mm') }<br />{ data.timezone }</span>
          <hr />
          <span className='small'>
            <a onClick={ this._displayDays }>days</a>
            <a onClick={ this._displayHours }>hours</a>
          </span>
          <hr />
          { this.state.display === 'days' && this._renderDays() }
          { this.state.display === 'hours' && this._renderHours() }
        </div>
      );
    }

    return (
      <div className='weather'>
        <small>
          No weather data for<br />{ this.now.format('MMMM Do YYYY') }<br />
          <a onClick={ () => this.props.fetch() }>Get some!</a>
        </small>
      </div>
    );
  }
};

Weather.propTypes = {
  state: PropTypes.string,
  fetch: PropTypes.func,
  error: PropTypes.any,
  data: PropTypes.any,
  lastUpdated: PropTypes.any
};

export default connect(Weather)
  .with('Weather')
  .map(({ state, fetch, refreshData }) => ({
    state: state.name,
    data: state.data,
    error: state.error,
    lastUpdated: state.lastUpdated,
    fetch
  }));
